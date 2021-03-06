﻿using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using NHSD.GPITF.BuyingCatalog.Interfaces;
using NHSD.GPITF.BuyingCatalog.Models;
using System;
using System.Collections.Generic;
using GifInt = Gif.Service.Contracts;

namespace NHSD.GPITF.BuyingCatalog.Datastore.CRM
{
  public sealed class OrganisationsDatastore : LongTermCachedDatastore<Organisations>, IOrganisationsDatastore
  {
    private readonly GifInt.IOrganisationsDatastore _crmDatastore;

    public OrganisationsDatastore(
      GifInt.IOrganisationsDatastore crmDatastore,
      ILogger<OrganisationsDatastore> logger,
      ISyncPolicyFactory policy,
      IConfiguration config,
      ILongTermCache cache) :
      base(logger, policy, config, cache)
    {
      _crmDatastore = crmDatastore;
    }

    public Organisations ByContact(string contactId)
    {
      return GetInternal(() =>
      {
        return GetFromCache(GetCachePathByContact(contactId), contactId);
      });
    }

    public Organisations ById(string organisationId)
    {
      return GetInternal(() =>
      {
        var val = _crmDatastore
          .ById(organisationId);

        return Converter.FromCrm(val);
      });
    }

    protected override IEnumerable<Organisations> GetAllFromSource(string path, string parameter = null)
    {
      throw new NotImplementedException();
    }

    protected override Organisations GetFromSource(string path, string parameter)
    {
      if (path == GetCachePathByContact(parameter))
      {
        var val = _crmDatastore
          .ByContact(parameter);

        var retval = Converter.FromCrm(val);

        // currently not used but required in data model
        retval.Status = "Active";

        return retval;
      }

      throw new ArgumentOutOfRangeException($"{nameof(path)}", path, "Unsupported cache path");
    }

    private static string GetCachePathByContact(string contactId)
    {
      return $"/{nameof(Organisations)}/ByContact/{contactId}";
    }
  }
}
