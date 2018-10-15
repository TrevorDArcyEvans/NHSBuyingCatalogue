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
    define(['ApiClient', 'model/PaginatedListSolutions', 'model/Solutions'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('../model/PaginatedListSolutions'), require('../model/Solutions'));
  } else {
    // Browser globals (root is window)
    if (!root.CatalogueApi) {
      root.CatalogueApi = {};
    }
    root.CatalogueApi.SolutionsApi = factory(root.CatalogueApi.ApiClient, root.CatalogueApi.PaginatedListSolutions, root.CatalogueApi.Solutions);
  }
}(this, function(ApiClient, PaginatedListSolutions, Solutions) {
  'use strict';

  /**
   * Solutions service.
   * @module api/SolutionsApi
   * @version 1.0.0-private-beta
   */

  /**
   * Constructs a new SolutionsApi. 
   * @alias module:api/SolutionsApi
   * @class
   * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
   * default to {@link module:ApiClient#instance} if unspecified.
   */
  var exports = function(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;



    /**
     * Get existing solution/s on which were onboarded onto a framework,  given the CRM identifier of the framework
     * @param {String} frameworkId CRM identifier of organisation to find
     * @param {Object} opts Optional parameters
     * @param {Number} opts.pageIndex 1-based index of page to return.  Defaults to 1
     * @param {Number} opts.pageSize number of items per page.  Defaults to 20
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/PaginatedListSolutions} and HTTP response
     */
    this.apiSolutionsByFrameworkByFrameworkIdGetWithHttpInfo = function(frameworkId, opts) {
      opts = opts || {};
      var postBody = null;

      // verify the required parameter 'frameworkId' is set
      if (frameworkId === undefined || frameworkId === null) {
        throw new Error("Missing the required parameter 'frameworkId' when calling apiSolutionsByFrameworkByFrameworkIdGet");
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
      var returnType = PaginatedListSolutions;

      return this.apiClient.callApi(
        '/api/Solutions/ByFramework/{frameworkId}', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType
      );
    }

    /**
     * Get existing solution/s on which were onboarded onto a framework,  given the CRM identifier of the framework
     * @param {String} frameworkId CRM identifier of organisation to find
     * @param {Object} opts Optional parameters
     * @param {Number} opts.pageIndex 1-based index of page to return.  Defaults to 1
     * @param {Number} opts.pageSize number of items per page.  Defaults to 20
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/PaginatedListSolutions}
     */
    this.apiSolutionsByFrameworkByFrameworkIdGet = function(frameworkId, opts) {
      return this.apiSolutionsByFrameworkByFrameworkIdGetWithHttpInfo(frameworkId, opts)
        .then(function(response_and_data) {
          return response_and_data.data;
        });
    }


    /**
     * Get an existing solution given its CRM identifier  Typically used to retrieve previous version
     * @param {String} id CRM identifier of solution to find
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/Solutions} and HTTP response
     */
    this.apiSolutionsByIdByIdGetWithHttpInfo = function(id) {
      var postBody = null;

      // verify the required parameter 'id' is set
      if (id === undefined || id === null) {
        throw new Error("Missing the required parameter 'id' when calling apiSolutionsByIdByIdGet");
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
      var returnType = Solutions;

      return this.apiClient.callApi(
        '/api/Solutions/ById/{id}', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType
      );
    }

    /**
     * Get an existing solution given its CRM identifier  Typically used to retrieve previous version
     * @param {String} id CRM identifier of solution to find
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/Solutions}
     */
    this.apiSolutionsByIdByIdGet = function(id) {
      return this.apiSolutionsByIdByIdGetWithHttpInfo(id)
        .then(function(response_and_data) {
          return response_and_data.data;
        });
    }


    /**
     * Retrieve all current solutions in a paged list for an organisation,  given the organisation’s CRM identifier
     * @param {String} organisationId CRM identifier of organisation
     * @param {Object} opts Optional parameters
     * @param {Number} opts.pageIndex 1-based index of page to return.  Defaults to 1
     * @param {Number} opts.pageSize number of items per page.  Defaults to 20
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/PaginatedListSolutions} and HTTP response
     */
    this.apiSolutionsByOrganisationByOrganisationIdGetWithHttpInfo = function(organisationId, opts) {
      opts = opts || {};
      var postBody = null;

      // verify the required parameter 'organisationId' is set
      if (organisationId === undefined || organisationId === null) {
        throw new Error("Missing the required parameter 'organisationId' when calling apiSolutionsByOrganisationByOrganisationIdGet");
      }


      var pathParams = {
        'organisationId': organisationId
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
      var returnType = PaginatedListSolutions;

      return this.apiClient.callApi(
        '/api/Solutions/ByOrganisation/{organisationId}', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType
      );
    }

    /**
     * Retrieve all current solutions in a paged list for an organisation,  given the organisation’s CRM identifier
     * @param {String} organisationId CRM identifier of organisation
     * @param {Object} opts Optional parameters
     * @param {Number} opts.pageIndex 1-based index of page to return.  Defaults to 1
     * @param {Number} opts.pageSize number of items per page.  Defaults to 20
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/PaginatedListSolutions}
     */
    this.apiSolutionsByOrganisationByOrganisationIdGet = function(organisationId, opts) {
      return this.apiSolutionsByOrganisationByOrganisationIdGetWithHttpInfo(organisationId, opts)
        .then(function(response_and_data) {
          return response_and_data.data;
        });
    }


    /**
     * Create a new solution for an organisation
     * @param {Object} opts Optional parameters
     * @param {module:model/Solutions} opts.solution new solution information
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/Solutions} and HTTP response
     */
    this.apiSolutionsPostWithHttpInfo = function(opts) {
      opts = opts || {};
      var postBody = opts['solution'];


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
      var returnType = Solutions;

      return this.apiClient.callApi(
        '/api/Solutions', 'POST',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType
      );
    }

    /**
     * Create a new solution for an organisation
     * @param {Object} opts Optional parameters
     * @param {module:model/Solutions} opts.solution new solution information
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/Solutions}
     */
    this.apiSolutionsPost = function(opts) {
      return this.apiSolutionsPostWithHttpInfo(opts)
        .then(function(response_and_data) {
          return response_and_data.data;
        });
    }


    /**
     * Update an existing solution with new information
     * @param {Object} opts Optional parameters
     * @param {module:model/Solutions} opts.solution contact with updated information
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing HTTP response
     */
    this.apiSolutionsPutWithHttpInfo = function(opts) {
      opts = opts || {};
      var postBody = opts['solution'];


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
      var accepts = [];
      var returnType = null;

      return this.apiClient.callApi(
        '/api/Solutions', 'PUT',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType
      );
    }

    /**
     * Update an existing solution with new information
     * @param {Object} opts Optional parameters
     * @param {module:model/Solutions} opts.solution contact with updated information
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}
     */
    this.apiSolutionsPut = function(opts) {
      return this.apiSolutionsPutWithHttpInfo(opts)
        .then(function(response_and_data) {
          return response_and_data.data;
        });
    }
  };

  return exports;
}));
