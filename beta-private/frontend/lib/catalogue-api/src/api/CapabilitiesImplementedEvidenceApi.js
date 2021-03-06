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
    define(['ApiClient', 'model/CapabilitiesImplementedEvidence', 'model/PaginatedListIEnumerableCapabilitiesImplementedEvidence'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('../model/CapabilitiesImplementedEvidence'), require('../model/PaginatedListIEnumerableCapabilitiesImplementedEvidence'));
  } else {
    // Browser globals (root is window)
    if (!root.CatalogueApi) {
      root.CatalogueApi = {};
    }
    root.CatalogueApi.CapabilitiesImplementedEvidenceApi = factory(root.CatalogueApi.ApiClient, root.CatalogueApi.CapabilitiesImplementedEvidence, root.CatalogueApi.PaginatedListIEnumerableCapabilitiesImplementedEvidence);
  }
}(this, function(ApiClient, CapabilitiesImplementedEvidence, PaginatedListIEnumerableCapabilitiesImplementedEvidence) {
  'use strict';

  /**
   * CapabilitiesImplementedEvidence service.
   * @module api/CapabilitiesImplementedEvidenceApi
   * @version 1.0.0-private-beta
   */

  /**
   * Constructs a new CapabilitiesImplementedEvidenceApi. 
   * @alias module:api/CapabilitiesImplementedEvidenceApi
   * @class
   * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
   * default to {@link module:ApiClient#instance} if unspecified.
   */
  var exports = function(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;



    /**
     * Get all Evidence for the given Claim  Each list is a distinct &#39;chain&#39; of Evidence ie original Evidence with all subsequent Evidence  The first item in each &#39;chain&#39; is the most current Evidence.  The last item in each &#39;chain&#39; is the original Evidence.
     * @param {String} claimId CRM identifier of Claim
     * @param {Object} opts Optional parameters
     * @param {Number} opts.pageIndex 1-based index of page to return.  Defaults to 1
     * @param {Number} opts.pageSize number of items per page.  Defaults to 20
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/PaginatedListIEnumerableCapabilitiesImplementedEvidence} and HTTP response
     */
    this.apiCapabilitiesImplementedEvidenceByClaimByClaimIdGetWithHttpInfo = function(claimId, opts) {
      opts = opts || {};
      var postBody = null;

      // verify the required parameter 'claimId' is set
      if (claimId === undefined || claimId === null) {
        throw new Error("Missing the required parameter 'claimId' when calling apiCapabilitiesImplementedEvidenceByClaimByClaimIdGet");
      }


      var pathParams = {
        'claimId': claimId
      };
      var queryParams = {
        'pageIndex': opts['pageIndex'],
        'pageSize': opts['pageSize'],
      };
      var collectionQueryParams = {
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = ['basic', 'oauth2'];
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = PaginatedListIEnumerableCapabilitiesImplementedEvidence;

      return this.apiClient.callApi(
        '/api/CapabilitiesImplementedEvidence/ByClaim/{claimId}', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType
      );
    }

    /**
     * Get all Evidence for the given Claim  Each list is a distinct &#39;chain&#39; of Evidence ie original Evidence with all subsequent Evidence  The first item in each &#39;chain&#39; is the most current Evidence.  The last item in each &#39;chain&#39; is the original Evidence.
     * @param {String} claimId CRM identifier of Claim
     * @param {Object} opts Optional parameters
     * @param {Number} opts.pageIndex 1-based index of page to return.  Defaults to 1
     * @param {Number} opts.pageSize number of items per page.  Defaults to 20
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/PaginatedListIEnumerableCapabilitiesImplementedEvidence}
     */
    this.apiCapabilitiesImplementedEvidenceByClaimByClaimIdGet = function(claimId, opts) {
      return this.apiCapabilitiesImplementedEvidenceByClaimByClaimIdGetWithHttpInfo(claimId, opts)
        .then(function(response_and_data) {
          return response_and_data.data;
        });
    }


    /**
     * Create a new evidence
     * @param {Object} opts Optional parameters
     * @param {module:model/CapabilitiesImplementedEvidence} opts.evidence new evidence information
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/CapabilitiesImplementedEvidence} and HTTP response
     */
    this.apiCapabilitiesImplementedEvidencePostWithHttpInfo = function(opts) {
      opts = opts || {};
      var postBody = opts['evidence'];


      var pathParams = {
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
      var contentTypes = ['application/json-patch+json', 'application/json', 'text/json', 'application/_*+json'];
      var accepts = ['application/json'];
      var returnType = CapabilitiesImplementedEvidence;

      return this.apiClient.callApi(
        '/api/CapabilitiesImplementedEvidence', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType
      );
    }

    /**
     * Create a new evidence
     * @param {Object} opts Optional parameters
     * @param {module:model/CapabilitiesImplementedEvidence} opts.evidence new evidence information
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/CapabilitiesImplementedEvidence}
     */
    this.apiCapabilitiesImplementedEvidencePost = function(opts) {
      return this.apiCapabilitiesImplementedEvidencePostWithHttpInfo(opts)
        .then(function(response_and_data) {
          return response_and_data.data;
        });
    }
  };

  return exports;
}));
