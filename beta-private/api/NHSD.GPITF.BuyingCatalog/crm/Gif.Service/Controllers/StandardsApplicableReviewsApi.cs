using Gif.Service.Attributes;
using Gif.Service.Const;
using Gif.Service.Contracts;
using Gif.Service.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Swashbuckle.AspNetCore.SwaggerGen;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using ZNetCS.AspNetCore.Authentication.Basic;

namespace Gif.Service.Controllers
{
  /// <summary>
  /// 
  /// </summary>
  [Authorize(AuthenticationSchemes = BasicAuthenticationDefaults.AuthenticationScheme + ",Bearer")]
  public class StandardsApplicableReviewsApiController : Controller
  {
    /// <summary>
    /// Get an existing Standard Applicable Review for a given Review Id
    /// </summary>

    private readonly IStandardsApplicableReviewsDatastore _datastore;

    public StandardsApplicableReviewsApiController(IStandardsApplicableReviewsDatastore datastore)
    {
      _datastore = datastore;
    }

  /// <param name="id">Review Id</param>
  /// <response code="200">Success</response>
  /// <response code="404">Solution not found in CRM</response>
  [HttpGet]
    [Route("/api/StandardsApplicableReviews/ById/{id}")]
    [ValidateModelState]
    [SwaggerOperation("ApiStandardsApplicableReviewByIdGet")]
    [SwaggerResponse(statusCode: 200, type: typeof(Solution), description: "Success")]
    public virtual IActionResult ApiStandardsApplicableReviewByIdGet([FromRoute][Required]string id)
    {
      try
      {
        var review = _datastore.ById(id);

        if (review == null || review?.Id == Guid.Empty)
          return StatusCode(404);

        return new ObjectResult(review);
      }
      catch (Crm.CrmApiException ex)
      {
        return StatusCode((int)ex.HttpStatus, ex.Message);
      }

    }

    /// <summary>
    /// Get all Reviews for a StandardsApplicable  Each list is a distinct &#39;chain&#39; of Review ie original Review with all subsequent Review  The first item in each &#39;chain&#39; is the most current Review.  The last item in each &#39;chain&#39; is the original Review.
    /// </summary>

    /// <param name="evidenceId">CRM identifier of StandardsApplicableEvidence</param>
    /// <param name="pageIndex">1-based index of page to return.  Defaults to 1</param>
    /// <param name="pageSize">number of items per page.  Defaults to 20</param>
    /// <response code="200">Success</response>
    /// <response code="404">EvidenceEntity not found</response>
    [HttpGet]
    [Route("/api/StandardsApplicableReviews/ByEvidence/{evidenceId}")]
    [ValidateModelState]
    [SwaggerOperation("ApiStandardsApplicableReviewsByEvidenceByEvidenceIdGet")]
    [SwaggerResponse(statusCode: 200, type: typeof(PaginatedListIEnumerableStandardsApplicableReviews), description: "Success")]
    public virtual IActionResult ApiStandardsApplicableReviewsByEvidenceByEvidenceIdGet([FromRoute][Required]string evidenceId, [FromQuery]int? pageIndex, [FromQuery]int? pageSize)
    {
      IEnumerable<IEnumerable<Review>> reviews;
      int totalPages;

      try
      {
        reviews = _datastore.ByEvidence(evidenceId);
        reviews = reviews.GetPagingValues(pageIndex, pageSize, out totalPages);
      }
      catch (Crm.CrmApiException ex)
      {
        return StatusCode((int)ex.HttpStatus, ex.Message);
      }

      return new ObjectResult(new PaginatedListIEnumerableStandardsApplicableReviews()
      {
        Items = reviews.ToList(),
        TotalPages = totalPages,
        PageSize = pageSize ?? Paging.DefaultPageSize,
        PageIndex = pageIndex ?? Paging.DefaultIndex
      });
    }

    /// <summary>
    /// Create a new Review for a StandardsApplicable
    /// </summary>

    /// <param name="review">new Review information</param>
    /// <response code="200">Success</response>
    /// <response code="404">StandardsApplicable not found</response>
    [HttpPost]
    [Route("/api/StandardsApplicableReviews")]
    [ValidateModelState]
    [SwaggerOperation("ApiStandardsApplicableReviewsPost")]
    [SwaggerResponse(statusCode: 200, type: typeof(Review), description: "Success")]
    public virtual IActionResult ApiStandardsApplicableReviewsPost([FromBody]Review review)
    {
      try
      {
        review = _datastore.Create(review);
      }
      catch (Crm.CrmApiException ex)
      {
        return StatusCode((int)ex.HttpStatus, ex.Message);
      }

      return new ObjectResult(review);
    }
  }
}
