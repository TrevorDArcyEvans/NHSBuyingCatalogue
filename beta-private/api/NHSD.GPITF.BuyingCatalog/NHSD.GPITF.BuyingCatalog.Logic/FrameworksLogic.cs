﻿using Microsoft.AspNetCore.Http;
using NHSD.GPITF.BuyingCatalog.Interfaces;
using NHSD.GPITF.BuyingCatalog.Models;
using System.Linq;

namespace NHSD.GPITF.BuyingCatalog.Logic
{
  public sealed class FrameworksLogic : LogicBase, IFrameworksLogic
  {
    private readonly IFrameworksDatastore _datastore;
    private readonly IFrameworksValidator _validator;
    private readonly IFrameworksFilter _filter;

    public FrameworksLogic(
      IFrameworksDatastore datastore,
      IHttpContextAccessor context,
      IFrameworksValidator validator,
      IFrameworksFilter filter) :
      base(context)
    {
      _datastore = datastore;
      _validator = validator;
      _filter = filter;
    }

    public IQueryable<Frameworks> ByCapability(string capabilityId)
    {
      return _datastore.ByCapability(capabilityId);
    }

    public IQueryable<Frameworks> ByStandard(string standardId)
    {
      return _datastore.ByStandard(standardId);
    }

    public Frameworks ById(string id)
    {
      return _datastore.ById(id);
    }

    public IQueryable<Frameworks> BySolution(string solutionId)
    {
      return _filter.Filter(_datastore.BySolution(solutionId));
    }

    public IQueryable<Frameworks> GetAll()
    {
      return _datastore.GetAll();
    }
  }
}