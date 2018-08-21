﻿using FluentValidation;
using Microsoft.AspNetCore.Http;
using NHSD.GPITF.BuyingCatalog.Interfaces;
using NHSD.GPITF.BuyingCatalog.Models;
using System;

namespace NHSD.GPITF.BuyingCatalog.Logic
{
  public sealed class SolutionsValidator : ValidatorBase<Solutions>, ISolutionsValidator
  {
    private readonly ISolutionsDatastore _solutionDatastore;
    private readonly IOrganisationsDatastore _organisationDatastore;

    public SolutionsValidator(
      IHttpContextAccessor context,
      ISolutionsDatastore solutionDatastore,
      IOrganisationsDatastore organisationDatastore) :
      base(context)
    {
      _solutionDatastore = solutionDatastore;
      _organisationDatastore = organisationDatastore;

      RuleSet(nameof(ISolutionsLogic.Update), () =>
      {
        RuleForUpdate();
      });
      RuleSet(nameof(ISolutionsLogic.Delete), () =>
      {
        RuleForDelete();
      });

      RuleFor(x => x.Id).NotNull().Must(id => Guid.TryParse(id, out _)).WithMessage("Invalid Id");
      RuleFor(x => x.OrganisationId).NotNull().Must(orgId => Guid.TryParse(orgId, out _)).WithMessage("Invalid OrganisationId");
    }

    private void RuleForUpdate()
    {
      RuleFor(x => x)
        .Must(x =>
        {
          /// NOTE:  null solution check is not quite correct
          /// as this would result in a FK exception if we let it through
          /// but it is good enough for the moment
          var soln = _solutionDatastore.ById(x.Id);
          return soln != null && x.OrganisationId == soln.OrganisationId;
        })
        .WithMessage("Cannot transfer solutions between organisations");
    }

    private void RuleForDelete()
    {
      RuleFor(x => x)
        .Must(x =>
        {
          var soln = _solutionDatastore.ById(x.Id);
          return soln != null;
        })
        .WithMessage("Solution not found")
        .Must(x =>
        {
          // TODO   change to use IOrganisationsDatastore.ByEmail
          var org = _organisationDatastore.ByEmail(x.OrganisationId);
          return org != null;
        })
        .WithMessage("Organisation not found");
    }
  }
}
