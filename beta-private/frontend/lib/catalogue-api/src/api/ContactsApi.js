/**
 * catalogue-api
 * NHS Digital GP IT Futures Buying Catalog API
 *
 * OpenAPI spec version: 1.0.0-private-beta
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 2.4.2-SNAPSHOT
 *
 * Do not edit the class manually.
 *
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/Contacts', 'model/PaginatedListContacts'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('../model/Contacts'), require('../model/PaginatedListContacts'));
  } else {
    // Browser globals (root is window)
    if (!root.CatalogueApi) {
      root.CatalogueApi = {};
    }
    root.CatalogueApi.ContactsApi = factory(root.CatalogueApi.ApiClient, root.CatalogueApi.Contacts, root.CatalogueApi.PaginatedListContacts);
  }
}(this, function(ApiClient, Contacts, PaginatedListContacts) {
  'use strict';

  /**
   * Contacts service.
   * @module api/ContactsApi
   * @version 1.0.0-private-beta
   */

  /**
   * Constructs a new ContactsApi. 
   * @alias module:api/ContactsApi
   * @class
   * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
   * default to {@link module:ApiClient#instance} if unspecified.
   */
  var exports = function(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;



    /**
     * Retrieve a contacts for an organisation, given the contact’s email address  Email address is case insensitive
     * @param {String} email email address to search for
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/Contacts} and HTTP response
     */
    this.apiContactsByEmailByEmailGetWithHttpInfo = function(email) {
      var postBody = null;

      // verify the required parameter 'email' is set
      if (email === undefined || email === null) {
        throw new Error("Missing the required parameter 'email' when calling apiContactsByEmailByEmailGet");
      }


      var pathParams = {
        'email': email
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
      var returnType = Contacts;

      return this.apiClient.callApi(
        '/api/Contacts/ByEmail/{email}', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType
      );
    }

    /**
     * Retrieve a contacts for an organisation, given the contact’s email address  Email address is case insensitive
     * @param {String} email email address to search for
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/Contacts}
     */
    this.apiContactsByEmailByEmailGet = function(email) {
      return this.apiContactsByEmailByEmailGetWithHttpInfo(email)
        .then(function(response_and_data) {
          return response_and_data.data;
        });
    }


    /**
     * Retrieve a contact for an organisation, given the contact’s CRM identifier
     * @param {String} id CRM identifier of contact
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/Contacts} and HTTP response
     */
    this.apiContactsByIdByIdGetWithHttpInfo = function(id) {
      var postBody = null;

      // verify the required parameter 'id' is set
      if (id === undefined || id === null) {
        throw new Error("Missing the required parameter 'id' when calling apiContactsByIdByIdGet");
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
      var returnType = Contacts;

      return this.apiClient.callApi(
        '/api/Contacts/ById/{id}', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType
      );
    }

    /**
     * Retrieve a contact for an organisation, given the contact’s CRM identifier
     * @param {String} id CRM identifier of contact
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/Contacts}
     */
    this.apiContactsByIdByIdGet = function(id) {
      return this.apiContactsByIdByIdGetWithHttpInfo(id)
        .then(function(response_and_data) {
          return response_and_data.data;
        });
    }


    /**
     * Retrieve all contacts for an organisation in a paged list, given the organisation’s CRM identifier
     * @param {String} organisationId CRM identifier of organisation
     * @param {Object} opts Optional parameters
     * @param {Number} opts.pageIndex 1-based index of page to return.  Defaults to 1
     * @param {Number} opts.pageSize number of items per page.  Defaults to 20
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/PaginatedListContacts} and HTTP response
     */
    this.apiContactsByOrganisationByOrganisationIdGetWithHttpInfo = function(organisationId, opts) {
      opts = opts || {};
      var postBody = null;

      // verify the required parameter 'organisationId' is set
      if (organisationId === undefined || organisationId === null) {
        throw new Error("Missing the required parameter 'organisationId' when calling apiContactsByOrganisationByOrganisationIdGet");
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
      var returnType = PaginatedListContacts;

      return this.apiClient.callApi(
        '/api/Contacts/ByOrganisation/{organisationId}', 'GET',
        pathParams, queryParams, collectionQueryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType
      );
    }

    /**
     * Retrieve all contacts for an organisation in a paged list, given the organisation’s CRM identifier
     * @param {String} organisationId CRM identifier of organisation
     * @param {Object} opts Optional parameters
     * @param {Number} opts.pageIndex 1-based index of page to return.  Defaults to 1
     * @param {Number} opts.pageSize number of items per page.  Defaults to 20
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/PaginatedListContacts}
     */
    this.apiContactsByOrganisationByOrganisationIdGet = function(organisationId, opts) {
      return this.apiContactsByOrganisationByOrganisationIdGetWithHttpInfo(organisationId, opts)
        .then(function(response_and_data) {
          return response_and_data.data;
        });
    }
  };

  return exports;
}));
