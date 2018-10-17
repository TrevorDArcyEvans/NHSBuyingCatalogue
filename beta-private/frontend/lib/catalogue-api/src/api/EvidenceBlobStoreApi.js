/**
 * catalogue-api
 * NHS Digital GP IT Futures Buying Catalog API
 *
 * OpenAPI spec version: 1.0.0-private-beta
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.4.0-SNAPSHOT
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.CatalogueApi) {
      root.CatalogueApi = {};
    }
    root.CatalogueApi.EvidenceBlobStoreApi = factory(root.CatalogueApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';

  /**
   * EvidenceBlobStore service.
   * @module api/EvidenceBlobStoreApi
   * @version 1.0.0-private-beta
   */

  /**
   * Constructs a new EvidenceBlobStoreApi. 
   * @alias module:api/EvidenceBlobStoreApi
   * @class
   * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
   * default to {@link module:ApiClient#instance} if unspecified.
   */
  var exports = function(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;



    /**
     * Create server side folder structure for specified solution
     * Server side folder structure is something like:  --Organisation  ----Solution  ------Capability Evidence  --------Appointment Management - Citizen  --------Appointment Management - GP  --------Clinical Decision Support  --------[all other claimed capabilities]    Will be done automagically when solution status changes to SolutionStatus.CapabilitiesAssessment
     * @param {String} solutionId unique identifier of solution
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing HTTP response
     */
    this.apiEvidenceBlobStorePrepareForSolutionBySolutionIdPutWithHttpInfo = function(solutionId) {
      var postBody = null;

      // verify the required parameter 'solutionId' is set
      if (solutionId === undefined || solutionId === null) {
        throw new Error("Missing the required parameter 'solutionId' when calling apiEvidenceBlobStorePrepareForSolutionBySolutionIdPut");
      }


      var pathParams = {
        'solutionId': solutionId
      };
      var queryParams = {
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['basic', 'oauth2'];
      var contentTypes = [];
      var accepts = [];
      var returnType = null;

      return this.apiClient.callApi(
        '/api/EvidenceBlobStore/PrepareForSolution/{solutionId}', 'PUT',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType
      );
    }

    /**
     * Create server side folder structure for specified solution
     * Server side folder structure is something like:  --Organisation  ----Solution  ------Capability Evidence  --------Appointment Management - Citizen  --------Appointment Management - GP  --------Clinical Decision Support  --------[all other claimed capabilities]    Will be done automagically when solution status changes to SolutionStatus.CapabilitiesAssessment
     * @param {String} solutionId unique identifier of solution
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}
     */
    this.apiEvidenceBlobStorePrepareForSolutionBySolutionIdPut = function(solutionId) {
      return this.apiEvidenceBlobStorePrepareForSolutionBySolutionIdPutWithHttpInfo(solutionId)
        .then(function(response_and_data) {
          return response_and_data.data;
        });
    }
  };

  return exports;
}));