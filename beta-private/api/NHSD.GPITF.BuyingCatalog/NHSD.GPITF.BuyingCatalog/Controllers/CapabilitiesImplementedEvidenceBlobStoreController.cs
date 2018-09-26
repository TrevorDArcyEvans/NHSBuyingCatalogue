﻿using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using NHSD.GPITF.BuyingCatalog.Attributes;
using NHSD.GPITF.BuyingCatalog.Interfaces;
using NHSD.GPITF.BuyingCatalog.Models;
using NHSD.GPITF.BuyingCatalog.OperationFilters;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.ComponentModel.DataAnnotations;
using System.Net;
using ZNetCS.AspNetCore.Authentication.Basic;

namespace NHSD.GPITF.BuyingCatalog.Controllers
{
  /// <summary>
  /// Manage capabilities evidence
  /// </summary>
  [ApiVersion("1")]
  [Route("api/[controller]")]
  [Authorize(
    Roles = Roles.Admin + "," + Roles.Buyer + "," + Roles.Supplier,
    AuthenticationSchemes = BasicAuthenticationDefaults.AuthenticationScheme + "," + JwtBearerDefaults.AuthenticationScheme)]
  [Produces("application/json")]
  public sealed class CapabilitiesImplementedEvidenceBlobStoreController : Controller
  {
    private readonly ICapabilitiesImplementedEvidenceBlobStoreLogic _logic;

    /// <summary>
    /// constructor
    /// </summary>
    /// <param name="logic">business logic</param>
    public CapabilitiesImplementedEvidenceBlobStoreController(ICapabilitiesImplementedEvidenceBlobStoreLogic logic)
    {
      _logic = logic;
    }

    /// <summary>
    /// Create server side folder structure for specified solution
    /// </summary>
    /// <remarks>
    /// Server side folder structure is something like:
    /// --Organisation
    /// ----Solution
    /// ------Capability Evidence
    /// --------Appointment Management - Citizen
    /// --------Appointment Management - GP
    /// --------Clinical Decision Support
    /// --------[all other claimed capabilities]
    /// </remarks>
    /// <param name="solutionId">unique identifier of solution</param>
    /// <response code="200">Success</response>
    /// <response code="404">Solution not found in CRM</response>
    [HttpGet]
    [Route("PrepareForSolution/{solutionId}")]
    [ValidateModelState]
    [SwaggerResponse(statusCode: (int)HttpStatusCode.OK, description: "Success")]
    [SwaggerResponse(statusCode: (int)HttpStatusCode.NotFound, description: "Solution not found in CRM")]
    public IActionResult PrepareForSolution([FromRoute][Required]string solutionId)
    {
      _logic.PrepareForSolution(solutionId);
      return new OkResult();
    }

    /// <summary>
    /// Upload a file to support a claim
    /// </summary>
    /// <param name="claimId">unique identifier of solution claim</param>
    /// <param name="file">Stream representing file to be uploaded</param>
    /// <param name="filename">name of file on the server</param>
    /// <param name="subFolder">optional sub-folder under claim.  This will be created if it does not exist.</param>
    /// <remarks>
    /// Server side folder structure is something like:
    /// --Organisation
    /// ----Solution
    /// ------Capability Evidence
    /// --------Appointment Management - Citizen
    /// --------Appointment Management - GP
    /// --------Clinical Decision Support
    /// --------[all other claimed capabilities]
    /// ----------Images
    /// ----------PDF
    /// ----------Videos
    /// ----------RTM
    /// ----------Misc
    ///
    /// where subFolder is an optional folder under a claimed capability ie Images, PDF, et al
    /// </remarks>
    /// <returns>externally accessible URL of file</returns>
    [HttpPost]
    [Route("AddEvidenceForClaim")]
    [SwaggerOperationFilter(typeof(EvidenceForClaimFileUploadOperation))]
    [ValidateModelState]
    [SwaggerResponse(statusCode: (int)HttpStatusCode.OK, type: typeof(string), description: "Success")]
    [SwaggerResponse(statusCode: (int)HttpStatusCode.NotFound, description: "Claim not found in CRM")]
    public IActionResult AddEvidenceForClaim([Required]string claimId, [Required]IFormFile file, [Required]string filename, string subFolder = null)
    {
      var extUrl = _logic.AddEvidenceForClaim(claimId, file.OpenReadStream(), filename, subFolder);
      return new OkObjectResult(extUrl);
    }

    /// <summary>
    /// List all files and folders for a claim
    /// </summary>
    /// <param name="claimId">unique identifier of solution claim</param>
    /// <param name="subFolder">optional sub-folder under claim</param>
    /// <param name="pageIndex">1-based index of page to return.  Defaults to 1</param>
    /// <param name="pageSize">number of items per page.  Defaults to 20</param>
    /// <returns>list of BlobInfo</returns>
    [HttpGet]
    [Route("EnumerateFolder/{claimId}")]
    [ValidateModelState]
    [SwaggerResponse(statusCode: (int)HttpStatusCode.OK, type: typeof(PaginatedList<BlobInfo>), description: "Success")]
    [SwaggerResponse(statusCode: (int)HttpStatusCode.NotFound, description: "Claim not found in CRM")]
    public IActionResult EnumerateFolder([FromRoute][Required]string claimId, [FromQuery]string subFolder, [FromQuery]int? pageIndex, [FromQuery]int? pageSize)
    {
      var infos = _logic.EnumerateFolder(claimId, subFolder);
      var retval = PaginatedList<BlobInfo>.Create(infos, pageIndex, pageSize);
      return new OkObjectResult(retval);
    }
  }
}