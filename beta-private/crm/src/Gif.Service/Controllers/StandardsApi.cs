/*
 * catalogue-api
 *
 * NHS Digital GP IT Futures Buying Catalog API
 *
 * OpenAPI spec version: 1.0.0-private-beta
 * 
 * Generated by: https://github.com/swagger-api/swagger-codegen.git
 */

using Gif.Service.Attributes;
using Gif.Service.Crm;
using Gif.Service.Models;
using Gif.Service.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using Gif.Service.Const;

namespace Gif.Service.Controllers
{
    /// <summary>
    /// 
    /// </summary>
    [Authorize]
    public class StandardsApiController : Controller
    {
        /// <summary>
        /// Get existing/optional Standard/s which are in the given Capability
        /// </summary>

        /// <param name="capabilityId">CRM identifier of Capability</param>
        /// <param name="isOptional">true if the specified Standard is optional with the Capability</param>
        /// <param name="pageIndex">1-based index of page to return.  Defaults to 1</param>
        /// <param name="pageSize">number of items per page.  Defaults to 20</param>
        /// <response code="200">Success</response>
        /// <response code="404">Capability not found in CRM</response>
        [HttpGet]
        [Route("/api/Standards/ByCapability/{capabilityId}")]
        [ValidateModelState]
        [SwaggerOperation("ApiStandardsByCapabilityByCapabilityIdGet")]
        [SwaggerResponse(statusCode: 200, type: typeof(PaginatedListStandards), description: "Success")]
        public virtual IActionResult ApiStandardsByCapabilityByCapabilityIdGet([FromRoute][Required]string capabilityId, [FromQuery]bool? isOptional, [FromQuery]int? pageIndex, [FromQuery]int? pageSize)
        {
            IEnumerable<Standard> standards;
            int totalPages;

            try
            {
                var service = new StandardsService(new Repository());
                standards = service.ByCapability(capabilityId, isOptional);
                standards = service.GetPagingValues(pageIndex, pageSize, standards, out totalPages);

            }
            catch (Crm.CrmApiException ex)
            {
                return StatusCode((int)ex.HttpStatus, ex.Message);
            }

            return new ObjectResult(new PaginatedListStandards()
            {
                Items = standards.ToList(),
                PageIndex = pageIndex ?? Paging.DefaultIndex,
                TotalPages = totalPages,
                PageSize = pageSize ?? Paging.DefaultPageSize,
            });

        }

        /// <summary>
        /// Get existing Standard/s which are in the given Framework
        /// </summary>

        /// <param name="frameworkId">CRM identifier of Framework</param>
        /// <param name="pageIndex">1-based index of page to return.  Defaults to 1</param>
        /// <param name="pageSize">number of items per page.  Defaults to 20</param>
        /// <response code="200">Success</response>
        /// <response code="404">Framework not found in CRM</response>
        [HttpGet]
        [Route("/api/Standards/ByFramework/{frameworkId}")]
        [ValidateModelState]
        [SwaggerOperation("ApiStandardsByFrameworkByFrameworkIdGet")]
        [SwaggerResponse(statusCode: 200, type: typeof(PaginatedListStandards), description: "Success")]
        public virtual IActionResult ApiStandardsByFrameworkByFrameworkIdGet([FromRoute][Required]string frameworkId, [FromQuery]int? pageIndex, [FromQuery]int? pageSize)
        {
            IEnumerable<Standard> standards;
            int totalPages;

            try
            {
                var service = new StandardsService(new Repository());
                standards = service.ByFramework(frameworkId);
                standards = service.GetPagingValues(pageIndex, pageSize, standards, out totalPages);
            }
            catch (Crm.CrmApiException ex)
            {
                return StatusCode((int)ex.HttpStatus, ex.Message);
            }

            return new ObjectResult(new PaginatedListStandards()
            {
                Items = standards.ToList(),
                TotalPages = totalPages,
                PageIndex = pageIndex ?? Paging.DefaultIndex,
                PageSize = pageSize ?? Paging.DefaultPageSize
            });
        }

        /// <summary>
        /// Get an existing standard given its CRM identifier  Typically used to retrieve previous version
        /// </summary>

        /// <param name="id">CRM identifier of standard to find</param>
        /// <response code="200">Success</response>
        /// <response code="404">Standard not found in CRM</response>
        [HttpGet]
        [Route("/api/Standards/ById/{id}")]
        [ValidateModelState]
        [SwaggerOperation("ApiStandardsByIdByIdGet")]
        [SwaggerResponse(statusCode: 200, type: typeof(Standard), description: "Success")]
        public virtual IActionResult ApiStandardsByIdByIdGet([FromRoute][Required]string id)
        {
            try
            {
                var standard = new StandardsService(new Repository()).ById(id);

                if (standard == null)
                    return StatusCode(404);

                return new ObjectResult(standard);
            }
            catch (Crm.CrmApiException ex)
            {
                return StatusCode((int)ex.HttpStatus, ex.Message);
            }

        }

        /// <summary>
        /// Get several existing Standards given their CRM identifiers
        /// </summary>

        /// <param name="ids">Array of CRM identifiers of Standards to find</param>
        /// <response code="200">Success</response>
        /// <response code="404">Standards not found in CRM</response>
        [HttpPost]
        [Route("/api/Standards/ByIds")]
        [ValidateModelState]
        [SwaggerOperation("ApiStandardsByIdsPost")]
        [SwaggerResponse(statusCode: 200, type: typeof(List<Standard>), description: "Success")]
        public virtual IActionResult ApiStandardsByIdsPost([FromBody]List<string> ids)
        {
            IEnumerable<Standard> standards;

            try
            {
                standards = new StandardsService(new Repository()).ByIds(ids);

                return new ObjectResult(standards);
            }
            catch (Crm.CrmApiException ex)
            {
                return StatusCode((int)ex.HttpStatus, ex.Message);
            }

        }

        /// <summary>
        /// Retrieve all current standards in a paged list
        /// </summary>

        /// <param name="pageIndex">1-based index of page to return.  Defaults to 1</param>
        /// <param name="pageSize">number of items per page.  Defaults to 20</param>
        /// <response code="200">Success - if no standards found, return empty list</response>
        [HttpGet]
        [Route("/api/Standards")]
        [ValidateModelState]
        [SwaggerOperation("ApiStandardsGet")]
        [SwaggerResponse(statusCode: 200, type: typeof(PaginatedListStandards), description: "Success - if no standards found, return empty list")]
        public virtual IActionResult ApiStandardsGet([FromQuery]int? pageIndex, [FromQuery]int? pageSize)
        {
            IEnumerable<Standard> standards;
            int totalPages;

            try
            {
                var service = new StandardsService(new Repository());
                standards = service.GetAll();
                standards = service.GetPagingValues(pageIndex, pageSize, standards, out totalPages);
            }
            catch (Crm.CrmApiException ex)
            {
                return StatusCode((int)ex.HttpStatus, ex.Message);
            }

            return new ObjectResult(new PaginatedListStandards
            {
                Items = standards.ToList(),
                TotalPages = totalPages,
                PageIndex = pageIndex ?? Paging.DefaultIndex,
                PageSize = pageSize ?? Paging.DefaultPageSize,
            });

        }
    }
}