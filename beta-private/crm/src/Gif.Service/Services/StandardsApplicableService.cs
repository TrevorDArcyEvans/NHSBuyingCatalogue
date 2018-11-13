﻿#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member
using Gif.Service.Attributes;
using Gif.Service.Contracts;
using Gif.Service.Crm;
using Gif.Service.Models;
using System.Collections.Generic;
using System.Linq;

namespace Gif.Service.Services
{
    public class StandardsApplicableService : ServiceBase, IStandardsApplicableDatastore
    {
        public StandardsApplicableService(IRepository repository) : base(repository)
        {
        }

        public StandardApplicable ById(string id)
        {
            var filterAttributes = new List<CrmFilterAttribute>
            {
                new CrmFilterAttribute("StandardApplicableId") {FilterName = "cc_standardapplicableid", FilterValue = id},
                new CrmFilterAttribute("StateCode") {FilterName = "statecode", FilterValue = "0"}
            };

            var appJson = Repository.RetrieveMultiple(new StandardApplicable().GetQueryString(null, filterAttributes), out Count);
            var standardApplicable = appJson?.FirstOrDefault();

            return new StandardApplicable(standardApplicable);
        }

        public IEnumerable<StandardApplicable> BySolution(string solutionId)
        {
            var standardsApplicable = new List<StandardApplicable>();

            var filterAttributes = new List<CrmFilterAttribute>
            {
                new CrmFilterAttribute("SolutionId") {FilterName = "_cc_solution_value", FilterValue = solutionId},
                new CrmFilterAttribute("StateCode") {FilterName = "statecode", FilterValue = "0"}
            };

            var appJson = Repository.RetrieveMultiple(new StandardApplicable().GetQueryString(null, filterAttributes, true, true), out Count);

            foreach (var standardApplicable in appJson.Children())
            {
                standardsApplicable.Add(new StandardApplicable(standardApplicable));
            }

            Count = standardsApplicable.Count();

            return standardsApplicable;
        }

        public StandardApplicable Create(StandardApplicable standardApplicable)
        {
            Repository.CreateEntity(standardApplicable.EntityName, standardApplicable.SerializeToODataPost());

            return standardApplicable;
        }

        public void Delete(StandardApplicable standardApplicable)
        {
            // soft delete by making record inactive
            Repository.UpdateField(standardApplicable.EntityName, "statecode", standardApplicable.Id, "1");
        }

        public void Update(StandardApplicable standardApplicable)
        {
            Repository.UpdateEntity(standardApplicable.EntityName, standardApplicable.Id, standardApplicable.SerializeToODataPut("cc_standardapplicableid"));
        }
    }
}
#pragma warning restore CS1591 // Missing XML comment for publicly visible type or member