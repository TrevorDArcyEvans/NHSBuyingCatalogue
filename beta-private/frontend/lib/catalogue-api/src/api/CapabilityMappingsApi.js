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
    define(['ApiClient', 'model/CapabilityMappings'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('../model/CapabilityMappings'));
  } else {
    // Browser globals (root is window)
    if (!root.CatalogueApi) {
      root.CatalogueApi = {};
    }
    root.CatalogueApi.CapabilityMappingsApi = factory(root.CatalogueApi.ApiClient, root.CatalogueApi.CapabilityMappings);
  }
}(this, function(ApiClient, CapabilityMappings) {
  'use strict';

  /**
   * CapabilityMappings service.
   * @module api/CapabilityMappingsApi
   * @version 1.0.0-private-beta
   */

  /**
   * Constructs a new CapabilityMappingsApi. 
   * @alias module:api/CapabilityMappingsApi
   * @class
   * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
   * default to {@link module:ApiClient#instance} if unspecified.
   */
  var exports = function(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;



    /**
     * Get capabilities with a list of corresponding, optional standards
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/CapabilityMappings} and HTTP response
     */
    this.apiPorcelainCapabilityMappingsGetWithHttpInfo = function() {
      var postBody = null;


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
      var contentTypes = [];
      var accepts = ['application/json'];
      var returnType = CapabilityMappings;

      return this.apiClient.callApi(
        '/api/porcelain/CapabilityMappings', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType
      );
    }

    /**
     * Get capabilities with a list of corresponding, optional standards
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/CapabilityMappings}
     */
    this.apiPorcelainCapabilityMappingsGet = function() {
      return this.apiPorcelainCapabilityMappingsGetWithHttpInfo()
        .then(function(response_and_data) {
          return response_and_data.data;
        });
    }
  };

  return exports;
}));
