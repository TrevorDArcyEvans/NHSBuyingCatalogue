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
    define(['ApiClient', 'model/Capabilities', 'model/PaginatedListCapabilities'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('../model/Capabilities'), require('../model/PaginatedListCapabilities'));
  } else {
    // Browser globals (root is window)
    if (!root.CatalogueApi) {
      root.CatalogueApi = {};
    }
    root.CatalogueApi.CapabilitiesApi = factory(root.CatalogueApi.ApiClient, root.CatalogueApi.Capabilities, root.CatalogueApi.PaginatedListCapabilities);
  }
}(this, function(ApiClient, Capabilities, PaginatedListCapabilities) {
  'use strict';

  /**
   * Capabilities service.
   * @module api/CapabilitiesApi
   * @version 1.0.0-private-beta
   */

  /**
   * Constructs a new CapabilitiesApi. 
   * @alias module:api/CapabilitiesApi
   * @class
   * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
   * default to {@link module:ApiClient#instance} if unspecified.
   */
  var exports = function(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;



    /**
     * Get existing Capability/s which are in the given Framework
     * @param {String} frameworkId CRM identifier of Framework
     * @param {Object} opts Optional parameters
     * @param {Number} opts.pageIndex 1-based index of page to return.  Defaults to 1
     * @param {Number} opts.pageSize number of items per page.  Defaults to 20
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/PaginatedListCapabilities} and HTTP response
     */
    this.apiCapabilitiesByFrameworkByFrameworkIdGetWithHttpInfo = function(frameworkId, opts) {
      opts = opts || {};
      var postBody = null;

      // verify the required parameter 'frameworkId' is set
      if (frameworkId === undefined || frameworkId === null) {
        throw new Error("Missing the required parameter 'frameworkId' when calling apiCapabilitiesByFrameworkByFrameworkIdGet");
      }


      var pathParams = {
        'frameworkId': frameworkId
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
      var returnType = PaginatedListCapabilities;

      return this.apiClient.callApi(
        '/api/Capabilities/ByFramework/{frameworkId}', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType
      );
    }

    /**
     * Get existing Capability/s which are in the given Framework
     * @param {String} frameworkId CRM identifier of Framework
     * @param {Object} opts Optional parameters
     * @param {Number} opts.pageIndex 1-based index of page to return.  Defaults to 1
     * @param {Number} opts.pageSize number of items per page.  Defaults to 20
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/PaginatedListCapabilities}
     */
    this.apiCapabilitiesByFrameworkByFrameworkIdGet = function(frameworkId, opts) {
      return this.apiCapabilitiesByFrameworkByFrameworkIdGetWithHttpInfo(frameworkId, opts)
        .then(function(response_and_data) {
          return response_and_data.data;
        });
    }


    /**
     * Get an existing capability given its CRM identifier  Typically used to retrieve previous version
     * @param {String} id CRM identifier of capability to find
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/Capabilities} and HTTP response
     */
    this.apiCapabilitiesByIdByIdGetWithHttpInfo = function(id) {
      var postBody = null;

      // verify the required parameter 'id' is set
      if (id === undefined || id === null) {
        throw new Error("Missing the required parameter 'id' when calling apiCapabilitiesByIdByIdGet");
      }


      var pathParams = {
        'id': id
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
      var returnType = Capabilities;

      return this.apiClient.callApi(
        '/api/Capabilities/ById/{id}', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType
      );
    }

    /**
     * Get an existing capability given its CRM identifier  Typically used to retrieve previous version
     * @param {String} id CRM identifier of capability to find
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/Capabilities}
     */
    this.apiCapabilitiesByIdByIdGet = function(id) {
      return this.apiCapabilitiesByIdByIdGetWithHttpInfo(id)
        .then(function(response_and_data) {
          return response_and_data.data;
        });
    }


    /**
     * Get several existing capabilities given their CRM identifiers
     * @param {Object} opts Optional parameters
     * @param {Array.<module:model/String>} opts.ids Array of CRM identifiers of capabilities to find
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link Array.<module:model/Capabilities>} and HTTP response
     */
    this.apiCapabilitiesByIdsPostWithHttpInfo = function(opts) {
      opts = opts || {};
      var postBody = opts['ids'];


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
      var returnType = [Capabilities];

      return this.apiClient.callApi(
        '/api/Capabilities/ByIds', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType
      );
    }

    /**
     * Get several existing capabilities given their CRM identifiers
     * @param {Object} opts Optional parameters
     * @param {Array.<module:model/String>} opts.ids Array of CRM identifiers of capabilities to find
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link Array.<module:model/Capabilities>}
     */
    this.apiCapabilitiesByIdsPost = function(opts) {
      return this.apiCapabilitiesByIdsPostWithHttpInfo(opts)
        .then(function(response_and_data) {
          return response_and_data.data;
        });
    }


    /**
     * Get existing Capability/s which require the given/optional Standard
     * @param {String} standardId CRM identifier of Standard
     * @param {Object} opts Optional parameters
     * @param {Boolean} opts.isOptional true if the specified Standard is optional with the Capability
     * @param {Number} opts.pageIndex 1-based index of page to return.  Defaults to 1
     * @param {Number} opts.pageSize number of items per page.  Defaults to 20
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/PaginatedListCapabilities} and HTTP response
     */
    this.apiCapabilitiesByStandardByStandardIdGetWithHttpInfo = function(standardId, opts) {
      opts = opts || {};
      var postBody = null;

      // verify the required parameter 'standardId' is set
      if (standardId === undefined || standardId === null) {
        throw new Error("Missing the required parameter 'standardId' when calling apiCapabilitiesByStandardByStandardIdGet");
      }


      var pathParams = {
        'standardId': standardId
      };
      var queryParams = {
        'isOptional': opts['isOptional'],
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
      var returnType = PaginatedListCapabilities;

      return this.apiClient.callApi(
        '/api/Capabilities/ByStandard/{standardId}', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType
      );
    }

    /**
     * Get existing Capability/s which require the given/optional Standard
     * @param {String} standardId CRM identifier of Standard
     * @param {Object} opts Optional parameters
     * @param {Boolean} opts.isOptional true if the specified Standard is optional with the Capability
     * @param {Number} opts.pageIndex 1-based index of page to return.  Defaults to 1
     * @param {Number} opts.pageSize number of items per page.  Defaults to 20
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/PaginatedListCapabilities}
     */
    this.apiCapabilitiesByStandardByStandardIdGet = function(standardId, opts) {
      return this.apiCapabilitiesByStandardByStandardIdGetWithHttpInfo(standardId, opts)
        .then(function(response_and_data) {
          return response_and_data.data;
        });
    }


    /**
     * Retrieve all current capabilities in a paged list
     * @param {Object} opts Optional parameters
     * @param {Number} opts.pageIndex 1-based index of page to return.  Defaults to 1
     * @param {Number} opts.pageSize number of items per page.  Defaults to 20
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/PaginatedListCapabilities} and HTTP response
     */
    this.apiCapabilitiesGetWithHttpInfo = function(opts) {
      opts = opts || {};
      var postBody = null;


      var pathParams = {
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
      var returnType = PaginatedListCapabilities;

      return this.apiClient.callApi(
        '/api/Capabilities', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType
      );
    }

    /**
     * Retrieve all current capabilities in a paged list
     * @param {Object} opts Optional parameters
     * @param {Number} opts.pageIndex 1-based index of page to return.  Defaults to 1
     * @param {Number} opts.pageSize number of items per page.  Defaults to 20
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/PaginatedListCapabilities}
     */
    this.apiCapabilitiesGet = function(opts) {
      return this.apiCapabilitiesGetWithHttpInfo(opts)
        .then(function(response_and_data) {
          return response_and_data.data;
        });
    }
  };

  return exports;
}));