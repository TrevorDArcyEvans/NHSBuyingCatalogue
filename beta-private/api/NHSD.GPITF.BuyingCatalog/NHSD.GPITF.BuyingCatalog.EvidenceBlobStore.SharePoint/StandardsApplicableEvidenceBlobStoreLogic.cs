﻿using NHSD.GPITF.BuyingCatalog.Interfaces;
using NHSD.GPITF.BuyingCatalog.Models;
using Microsoft.Extensions.Configuration;

namespace NHSD.GPITF.BuyingCatalog.EvidenceBlobStore.SharePoint
{
  public sealed class StandardsApplicableEvidenceBlobStoreLogic : EvidenceBlobStoreLogic, IStandardsApplicableEvidenceBlobStoreLogic
  {
    public StandardsApplicableEvidenceBlobStoreLogic(
      IConfiguration config,
      IOrganisationsDatastore organisationsDatastore,
      ISolutionsDatastore solutionsDatastore,
      ICapabilitiesImplementedDatastore capabilitiesImplementedDatastore,
      IStandardsApplicableDatastore standardsApplicableDatastore,
      ICapabilitiesDatastore capabilitiesDatastore,
      IStandardsDatastore standardsDatastore,
      IEvidenceBlobStoreValidator validator,
      IStandardsApplicableEvidenceBlobStoreValidator claimValidator) :
      base(
        config,
        organisationsDatastore,
        solutionsDatastore,
        capabilitiesImplementedDatastore,
        standardsApplicableDatastore,
        capabilitiesDatastore,
        standardsDatastore,
        validator,
        claimValidator)
    {
    }

    protected override string GetFolderName()
    {
      return StandardsFolderName;
    }

    protected override string GetFolderClaimName(ClaimsBase claim)
    {
      var specifiClaim = (StandardsApplicable)claim;
      var std = _standardsDatastore.ById(specifiClaim.StandardId);

      return std.Name;
    }

    protected override IClaimsDatastore<ClaimsBase> ClaimsDatastore
    {
      get
      {
        return (IClaimsDatastore<ClaimsBase>)_standardsApplicableDatastore;
      }
    }
  }
}