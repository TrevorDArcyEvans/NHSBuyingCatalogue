﻿using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using NHSD.GPITF.BuyingCatalog.Attributes;
using NHSD.GPITF.BuyingCatalog.Interfaces;
using NHSD.GPITF.BuyingCatalog.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net;
using ZNetCS.AspNetCore.Authentication.Basic;

namespace NHSD.GPITF.BuyingCatalog.Controllers
{
  /// <summary>
  /// Create and retrieve CapabilitiesImplementedReviews
  /// </summary>
  [ApiVersion("1")]
  [Route("api/[controller]")]
  [Authorize(
    Roles = Roles.Admin + "," + Roles.Buyer + "," + Roles.Supplier,
    AuthenticationSchemes = BasicAuthenticationDefaults.AuthenticationScheme + "," + JwtBearerDefaults.AuthenticationScheme)]
  [Produces("application/json")]
  public sealed class CapabilitiesImplementedReviewsController : Controller
  {
    private readonly ICapabilitiesImplementedReviewsLogic _logic;

    /// <summary>
    /// constructor
    /// </summary>
    /// <param name="logic">business logic</param>
    public CapabilitiesImplementedReviewsController(ICapabilitiesImplementedReviewsLogic logic)
    {
      _logic = logic;
    }

    /// <summary>
    /// TODO
    /// </summary>
    /// <param name="capabilitiesImplementedId">CRM identifier of CapabilitiesImplemented</param>
    /// <param name="evidenceId">CRM identifier of CapabilitiesImplementedEvidence</param>
    /// <param name="pageIndex">1-based index of page to return.  Defaults to 1</param>
    /// <param name="pageSize">number of items per page.  Defaults to 20</param>
    /// <response code="200">Success</response>
    /// <response code="404">CapabilitiesImplementedEvidence not found</response>
    [HttpGet]
    [Route("CapabilitiesImplemented/{capabilitiesImplementedId}/Evidence/{evidenceId}/Reviews")]
    [ValidateModelState]
    [SwaggerResponse(statusCode: (int)HttpStatusCode.OK, type: typeof(PaginatedList<CapabilitiesImplementedReviews>), description: "Success")]
    [SwaggerResponse(statusCode: (int)HttpStatusCode.NotFound, description: "CapabilitiesImplemented not found")]
    public IActionResult ByEvidence([FromRoute][Required]string capabilitiesImplementedId, [FromRoute][Required]string evidenceId, [FromQuery]int? pageIndex, [FromQuery]int? pageSize)
    {
      var evReviews = _logic.ByEvidence(evidenceId);
      var retval = PaginatedList<CapabilitiesImplementedReviews>.Create(evReviews, pageIndex, pageSize);
      return evReviews.Count() > 0 ? (IActionResult)new OkObjectResult(evReviews) : new NotFoundResult();
    }
  }
}
