﻿#pragma warning disable 1591
using Gif.Service.Contracts;
using Gif.Service.Crm;
using Gif.Service.Models;
using System.Collections.Generic;
using System.Linq;
using Gif.Service.Enums;

namespace Gif.Service.Services
{
    public class SolutionExService : ServiceBase<SolutionEx>, ISolutionsExDatastore
    {
        private readonly ISolutionsDatastore _solutionsDatastore;
        private readonly ITechnicalContactsDatastore _technicalContactsDatastore;
        private readonly ICapabilitiesImplementedDatastore _claimedCapabilityDatastore;
        private readonly IStandardsApplicableDatastore _claimedStandardDatastore;
        private readonly ICapabilitiesImplementedEvidenceDatastore _claimedCapabilityEvidenceDatastore;
        private readonly ICapabilitiesImplementedReviewsDatastore _claimedCapabilityReviewsDatastore;
        private readonly IStandardsApplicableEvidenceDatastore _claimedStandardEvidenceDatastore;
        private readonly IStandardsApplicableReviewsDatastore _claimedStandardReviewsDatastore;

        public SolutionExService(IRepository repository,
            ISolutionsDatastore solutionsDatastore,
            ITechnicalContactsDatastore technicalContactsDatastore,
            ICapabilitiesImplementedDatastore claimedCapabilityDatastore,
            IStandardsApplicableDatastore claimedStandardDatastore,
            ICapabilitiesImplementedEvidenceDatastore claimedCapabilityEvidenceDatastore,
            ICapabilitiesImplementedReviewsDatastore claimedCapabilityReviewsDatastore,
            IStandardsApplicableEvidenceDatastore claimedStandardEvidenceDatastore,
            IStandardsApplicableReviewsDatastore claimedStandardReviewsDatastore) : base(repository)
        {
            _solutionsDatastore = solutionsDatastore;
            _technicalContactsDatastore = technicalContactsDatastore;
            _claimedCapabilityDatastore = claimedCapabilityDatastore;
            _claimedStandardDatastore = claimedStandardDatastore;
            _claimedCapabilityEvidenceDatastore = claimedCapabilityEvidenceDatastore;
            _claimedCapabilityReviewsDatastore = claimedCapabilityReviewsDatastore;
            _claimedStandardEvidenceDatastore = claimedStandardEvidenceDatastore;
            _claimedStandardReviewsDatastore = claimedStandardReviewsDatastore;
        }

        public SolutionEx BySolution(string solutionId)
        {
            var solution = new SolutionEx
            {
                Solution = _solutionsDatastore.ById(solutionId),
                TechnicalContact = _technicalContactsDatastore.BySolution(solutionId).ToList(),
                ClaimedCapability = _claimedCapabilityDatastore.BySolution(solutionId).ToList(),
                ClaimedStandard = _claimedStandardDatastore.BySolution(solutionId).ToList()
            };

            solution.ClaimedCapabilityEvidence = solution.ClaimedCapability
            .SelectMany(cc => _claimedCapabilityEvidenceDatastore.ByClaim(cc.Id.ToString()))
            .SelectMany(x => x)
            .ToList();

            solution.ClaimedCapabilityReview = solution.ClaimedCapabilityEvidence
            .SelectMany(cce => _claimedCapabilityReviewsDatastore.ByEvidence(cce.Id.ToString()))
            .SelectMany(x => x)
            .ToList();

            solution.ClaimedStandardEvidence = solution.ClaimedStandard
            .SelectMany(cs => _claimedStandardEvidenceDatastore.ByClaim(cs.Id.ToString()))
            .SelectMany(x => x)
            .ToList();

            solution.ClaimedStandardReview = solution.ClaimedStandardEvidence
            .SelectMany(cse => _claimedStandardReviewsDatastore.ByEvidence(cse.Id.ToString()))
            .SelectMany(x => x)
            .ToList();

            return solution;
        }

        public void Update(SolutionEx solnEx)
        {
            var batchData = new List<BatchData>
            {
                new BatchData
                {
                    Id = solnEx.Solution.Id,
                    Name = solnEx.Solution.EntityName,
                    Type = BatchTypeEnum.Delete,
                    EntityData = "{}"
                },
                new BatchData
                {
                    Id = solnEx.Solution.Id,
                    Name = solnEx.Solution.EntityName,
                    EntityData = solnEx.Solution.SerializeToODataPut("cc_solutionid")
                }
            };

            //Sort Evidence/Reviews in order by previous Id
            solnEx.ClaimedCapabilityEvidence = GetInsertionTree(solnEx.ClaimedCapabilityEvidence);
            solnEx.ClaimedCapabilityReview = GetInsertionTree(solnEx.ClaimedCapabilityReview);
            solnEx.ClaimedStandardEvidence = GetInsertionTree(solnEx.ClaimedStandardEvidence);
            solnEx.ClaimedStandardReview = GetInsertionTree(solnEx.ClaimedStandardReview);

            foreach (var technicalContact in solnEx.TechnicalContact)
            {
                batchData.Add(new BatchData { Id = technicalContact.Id, Name = technicalContact.EntityName, EntityData = technicalContact.SerializeToODataPut("cc_technicalcontactid") });
            }

            foreach (var standardApplicable in solnEx.ClaimedStandard)
            {
                batchData.Add(new BatchData { Id = standardApplicable.Id, Name = standardApplicable.EntityName, EntityData = standardApplicable.SerializeToODataPut("cc_standardapplicableid") });
            }

            foreach (var capabilityImplemented in solnEx.ClaimedCapability)
            {
                batchData.Add(new BatchData { Id = capabilityImplemented.Id, Name = capabilityImplemented.EntityName, EntityData = capabilityImplemented.SerializeToODataPut("cc_capabilityimplementedid") });
            }

            foreach (var standardEvidence in solnEx.ClaimedStandardEvidence)
            {
                batchData.Add(new BatchData { Id = standardEvidence.Id, Name = standardEvidence.EntityName, EntityData = standardEvidence.SerializeToODataPut("cc_evidenceid") });
            }

            foreach (var capabilityEvidence in solnEx.ClaimedCapabilityEvidence)
            {
                batchData.Add(new BatchData { Id = capabilityEvidence.Id, Name = capabilityEvidence.EntityName, EntityData = capabilityEvidence.SerializeToODataPut("cc_evidenceid") });
            }

            foreach (var standardReview in solnEx.ClaimedStandardReview)
            {
                batchData.Add(new BatchData { Id = standardReview.Id, Name = standardReview.EntityName, EntityData = standardReview.SerializeToODataPut("cc_reviewid") });
            }

            foreach (var capabilityReview in solnEx.ClaimedCapabilityReview)
            {
                batchData.Add(new BatchData { Id = capabilityReview.Id, Name = capabilityReview.EntityName, EntityData = capabilityReview.SerializeToODataPut("cc_reviewid") });
            }

            Repository.CreateBatch(batchData);
        }
    }

}
#pragma warning restore 1591
