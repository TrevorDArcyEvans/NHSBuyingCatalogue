/*
 * catalogue-api
 *
 * NHS Digital GP IT Futures Buying Catalog API
 *
 * OpenAPI spec version: 1.0.0-private-beta
 * 
 * Generated by: https://github.com/swagger-api/swagger-codegen.git
 */

using System;
using System.ComponentModel.DataAnnotations;
using Gif.Service.Attributes;
using Gif.Service.Crm;
using Gif.Service.Services;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Gif.Service.Controllers
{ 
    /// <summary>
    /// 
    /// </summary>
    public class LinkManagerApiController : Controller
    {
        /// <summary>
        /// Create a link between a Framework and a Solution
        /// </summary>

        /// <param name="frameworkId">CRM identifier of Framework</param>
        /// <param name="solutionId">CRM identifier of Solution</param>
        /// <response code="200">Success</response>
        /// <response code="404">One entity not found</response>
        /// <response code="412">Link already exists</response>
        [HttpPost]
        [Route("/api/LinkManager/FrameworkSolution/Create/{frameworkId}/{solutionId}")]
        [ValidateModelState]
        [SwaggerOperation("ApiLinkManagerFrameworkSolutionCreateByFrameworkIdBySolutionIdPost")]
        public virtual IActionResult ApiLinkManagerFrameworkSolutionCreateByFrameworkIdBySolutionIdPost([FromRoute][Required]string frameworkId, [FromRoute][Required]string solutionId)
        {
            try
            {
                new LinkManagerService(new Repository()).FrameworkSolutionCreate(frameworkId, solutionId);               
            }
            catch (Crm.CrmApiException ex)
            {
                return StatusCode((int)ex.HttpStatus, ex.Message);
            }

            return new ObjectResult(200);
        }
    }
}
