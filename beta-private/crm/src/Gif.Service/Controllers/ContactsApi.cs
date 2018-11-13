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
    public class ContactsApiController : Controller
    {
        /// <summary>
        /// Retrieve a contacts for an organisation, given the contact’s email address  Email address is case insensitive
        /// </summary>

        /// <param name="email">email address to search for</param>
        /// <response code="200">Success</response>
        /// <response code="404">Contact not found</response>
        [HttpGet]
        [Route("/api/Contacts/ByEmail/{email}")]
        [ValidateModelState]
        [SwaggerOperation("ApiContactsByEmailByEmailGet")]
        [SwaggerResponse(statusCode: 200, type: typeof(Contact), description: "Success")]
        public virtual IActionResult ApiContactsByEmailByEmailGet([FromRoute][Required]string email)
        {
            try
            {
                var contact = new ContactsService(new Repository()).ByEmail(email);

                if (contact == null)
                    return StatusCode(404);

                return new ObjectResult(contact);

            }
            catch (Crm.CrmApiException ex)
            {
                return StatusCode((int)ex.HttpStatus, ex.Message);
            }

        }

        /// <summary>
        /// Retrieve a contact for an organisation, given the contact’s CRM identifier
        /// </summary>

        /// <param name="id">CRM identifier of contact</param>
        /// <response code="200">Success</response>
        /// <response code="404">Contact not found</response>
        [HttpGet]
        [Route("/api/Contacts/ById/{id}")]
        [ValidateModelState]
        [SwaggerOperation("ApiContactsByIdByIdGet")]
        [SwaggerResponse(statusCode: 200, type: typeof(Contact), description: "Success")]
        public virtual IActionResult ApiContactsByIdByIdGet([FromRoute][Required]string id)
        {
            try
            {
                var contact = new ContactsService(new Repository()).ById(id);

                if (contact == null)
                    return StatusCode(404);

                return new ObjectResult(contact);
            }
            catch (Crm.CrmApiException ex)
            {
                return StatusCode((int)ex.HttpStatus, ex.Message);
            }
        }

        /// <summary>
        /// Retrieve all contacts for an organisation in a paged list, given the organisation’s CRM identifier
        /// </summary>

        /// <param name="organisationId">CRM identifier of organisation</param>
        /// <param name="pageIndex">1-based index of page to return.  Defaults to 1</param>
        /// <param name="pageSize">number of items per page.  Defaults to 20</param>
        /// <response code="200">Success</response>
        /// <response code="404">Organisation not found in ODS</response>
        [HttpGet]
        [Route("/api/Contacts/ByOrganisation/{organisationId}")]
        [ValidateModelState]
        [SwaggerOperation("ApiContactsByOrganisationByOrganisationIdGet")]
        [SwaggerResponse(statusCode: 200, type: typeof(PaginatedListContacts), description: "Success")]
        public virtual IActionResult ApiContactsByOrganisationByOrganisationIdGet([FromRoute][Required]string organisationId, [FromQuery]int? pageIndex, [FromQuery]int? pageSize)
        {
            IEnumerable<Contact> contacts;
            int totalPages;

            try
            {
                var service  = new ContactsService(new Repository());
                contacts = service.ByOrganisation(organisationId);
                contacts = service.GetPagingValues(pageIndex, pageSize, contacts, out totalPages);
            }
            catch (Crm.CrmApiException ex)
            {
                return StatusCode((int)ex.HttpStatus, ex.Message);
            }

            return new ObjectResult(new PaginatedListContacts()
            {
                Items = contacts.ToList(),
                TotalPages = totalPages,
                PageSize = pageSize ?? Paging.DefaultPageSize,
                PageIndex = pageIndex ?? Paging.DefaultIndex
            });

        }
    }
}