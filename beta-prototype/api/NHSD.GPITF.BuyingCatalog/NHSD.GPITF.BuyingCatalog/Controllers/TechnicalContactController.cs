﻿using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using NHSD.GPITF.BuyingCatalog.Attributes;
using NHSD.GPITF.BuyingCatalog.Examples;
using NHSD.GPITF.BuyingCatalog.Interfaces;
using NHSD.GPITF.BuyingCatalog.Models;
using Swashbuckle.AspNetCore.Examples;
using Swashbuckle.AspNetCore.SwaggerGen;
using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net;
using ZNetCS.AspNetCore.Authentication.Basic;

namespace NHSD.GPITF.BuyingCatalog.Controllers
{
  /// <summary>
  /// Manage Technical Contacts for a Solution
  /// </summary>
  [ApiVersion("1")]
  [Route("api/[controller]")]
  [Authorize(
    Roles = Roles.Admin + "," + Roles.Buyer + "," + Roles.Supplier,
    AuthenticationSchemes = BasicAuthenticationDefaults.AuthenticationScheme + "," + JwtBearerDefaults.AuthenticationScheme)]
  [Produces("application/json")]
  public sealed class TechnicalContactController : Controller
  {
    private readonly ITechnicalContactLogic _logic;

    /// <summary>
    /// constructor
    /// </summary>
    /// <param name="logic">business logic</param>
    public TechnicalContactController(ITechnicalContactLogic logic)
    {
      _logic = logic;
    }

    /// <summary>
    /// Retrieve all Technical Contacts for a solution in a paged list,
    /// given the solution’s CRM identifier
    /// </summary>
    /// <param name="solutionId">CRM identifier of solution</param>
    /// <param name="pageIndex">1-based index of page to return.  Defaults to 1</param>
    /// <param name="pageSize">number of items per page.  Defaults to 20</param>
    /// <response code="200">Success</response>
    /// <response code="404">Solution not found in CRM</response>
    [HttpGet]
    [Route("BySolution/{solutionId}")]
    [ValidateModelState]
    [SwaggerResponse(statusCode: (int)HttpStatusCode.OK, type: typeof(PaginatedList<TechnicalContact>), description: "Success")]
    [SwaggerResponse(statusCode: (int)HttpStatusCode.NotFound, description: "Solution not found in CRM")]
    public IActionResult BySolution([FromRoute][Required]string solutionId, [FromQuery]int? pageIndex, [FromQuery]int? pageSize)
    {
      var techConts = _logic.BySolution(solutionId);
      var retval = PaginatedList<TechnicalContact>.Create(techConts, pageIndex, pageSize);
      return techConts.Count() > 0 ? (IActionResult)new OkObjectResult(retval) : new NotFoundResult();
    }

    /// <summary>
    /// Create a new Technical Contact for a Solution
    /// </summary>
    /// <param name="techCont">new Technical Contact information</param>
    /// <response code="200">Success</response>
    /// <response code="404">Solution not found in CRM</response>
    [HttpPost]
    [Route("Create")]
    [ValidateModelState]
    [SwaggerResponse(statusCode: (int)HttpStatusCode.OK, type: typeof(TechnicalContact), description: "Success")]
    [SwaggerResponse(statusCode: (int)HttpStatusCode.NotFound, description: "Solution not found in CRM")]
    [SwaggerRequestExample(typeof(TechnicalContact), typeof(TechnicalContactExample), jsonConverter: typeof(StringEnumConverter))]
    public IActionResult Create([FromBody]TechnicalContact techCont)
    {
      try
      {
        var newTechCont = _logic.Create(techCont);
        return new OkObjectResult(newTechCont);
      }
      catch (Exception ex)
      {
        return new NotFoundObjectResult(ex);
      }
    }

    /// <summary>
    /// Update a Technical Contact with new information
    /// </summary>
    /// <param name="techCont">Technical Contact with updated information</param>
    /// <response code="200">Success</response>
    /// <response code="404">Technical Contact or Solution not found in CRM</response>
    [HttpPut]
    [Route("Update")]
    [ValidateModelState]
    [SwaggerResponse(statusCode: (int)HttpStatusCode.OK, description: "Success")]
    [SwaggerResponse(statusCode: (int)HttpStatusCode.NotFound, description: "Technical Contact or Solution not found in CRM")]
    [SwaggerRequestExample(typeof(TechnicalContact), typeof(TechnicalContactExample), jsonConverter: typeof(StringEnumConverter))]
    public IActionResult Update([FromBody]TechnicalContact techCont)
    {
      try
      {
        _logic.Update(techCont);
        return new OkResult();
      }
      catch (Exception ex)
      {
        return new NotFoundObjectResult(ex);
      }
    }

    /// <summary>
    /// Delete an existing Technical Contact for a Solution
    /// </summary>
    /// <param name="techCont">existing Technical Contact information</param>
    /// <response code="200">Success</response>
    /// <response code="404">Technical Contact or Solution not found in CRM</response>
    [HttpDelete]
    [Route("Delete")]
    [ValidateModelState]
    [SwaggerResponse(statusCode: (int)HttpStatusCode.OK, description: "Success")]
    [SwaggerResponse(statusCode: (int)HttpStatusCode.NotFound, description: "Technical Contact or Solution not found in CRM")]
    [SwaggerRequestExample(typeof(TechnicalContact), typeof(TechnicalContactExample), jsonConverter: typeof(StringEnumConverter))]
    public IActionResult Delete([FromBody]TechnicalContact techCont)
    {
      try
      {
        _logic.Delete(techCont);
        return new OkResult();
      }
      catch (Exception ex)
      {
        return new NotFoundObjectResult(ex);
      }
    }
  }
}
