﻿using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using NHSD.GPITF.BuyingCatalog.Datastore.CRM.Interfaces;
using NHSD.GPITF.BuyingCatalog.Interfaces;
using NHSD.GPITF.BuyingCatalog.Models;

namespace NHSD.GPITF.BuyingCatalog.Datastore.CRM
{
  public sealed class OrganisationsDatastore : CachedDatastore<Organisations>, IOrganisationsDatastore
  {
    public OrganisationsDatastore(
      IRestClientFactory crmConnectionFactory,
      ILogger<OrganisationsDatastore> logger,
      ISyncPolicyFactory policy,
      IConfiguration config,
      IDatastoreCache cache) :
      base(crmConnectionFactory, logger, policy, config, cache)
    {
    }

    private string ResourceBase { get; } = "/Organisations";

    public Organisations ByContact(string contactId)
    {
      return GetInternal(() =>
      {
        return Get($"{ResourceBase}/ByContact/{contactId}");
      });
    }

    public Organisations ById(string id)
    {
      return GetInternal(() =>
      {
        var request = GetRequest($"{ResourceBase}/ById/{id}");
        var retval = GetResponse<Organisations>(request);

        return retval;
      });
    }
  }
}
