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
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.CatalogueApi) {
      root.CatalogueApi = {};
    }
    root.CatalogueApi.CapabilitiesImplementedEvidence = factory(root.CatalogueApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The CapabilitiesImplementedEvidence model module.
   * @module model/CapabilitiesImplementedEvidence
   * @version 1.0.0-private-beta
   */

  /**
   * Constructs a new <code>CapabilitiesImplementedEvidence</code>.
   * A piece of &#39;evidence&#39; which supports a claim to a ‘capability’.  This is then assessed by NHS to verify the ‘solution’ complies with the ‘capability’ it has claimed.
   * @alias module:model/CapabilitiesImplementedEvidence
   * @class
   * @param id {String} Unique identifier of entity
   * @param claimId {String} Unique identifier of Claim
   * @param createdById {String} Unique identifier of Contact who created record  Derived from calling context  SET ON SERVER
   */
  var exports = function(id, claimId, createdById) {
    var _this = this;

    _this['id'] = id;

    _this['claimId'] = claimId;
    _this['createdById'] = createdById;




  };

  /**
   * Constructs a <code>CapabilitiesImplementedEvidence</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/CapabilitiesImplementedEvidence} obj Optional instance to populate.
   * @return {module:model/CapabilitiesImplementedEvidence} The populated <code>CapabilitiesImplementedEvidence</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('id')) {
        obj['id'] = ApiClient.convertToType(data['id'], 'String');
      }
      if (data.hasOwnProperty('previousId')) {
        obj['previousId'] = ApiClient.convertToType(data['previousId'], 'String');
      }
      if (data.hasOwnProperty('claimId')) {
        obj['claimId'] = ApiClient.convertToType(data['claimId'], 'String');
      }
      if (data.hasOwnProperty('createdById')) {
        obj['createdById'] = ApiClient.convertToType(data['createdById'], 'String');
      }
      if (data.hasOwnProperty('createdOn')) {
        obj['createdOn'] = ApiClient.convertToType(data['createdOn'], 'Date');
      }
      if (data.hasOwnProperty('evidence')) {
        obj['evidence'] = ApiClient.convertToType(data['evidence'], 'String');
      }
      if (data.hasOwnProperty('hasRequestedLiveDemo')) {
        obj['hasRequestedLiveDemo'] = ApiClient.convertToType(data['hasRequestedLiveDemo'], 'Boolean');
      }
      if (data.hasOwnProperty('blobId')) {
        obj['blobId'] = ApiClient.convertToType(data['blobId'], 'String');
      }
    }
    return obj;
  }

  /**
   * Unique identifier of entity
   * @member {String} id
   */
  exports.prototype['id'] = undefined;
  /**
   * Unique identifier of previous version of entity
   * @member {String} previousId
   */
  exports.prototype['previousId'] = undefined;
  /**
   * Unique identifier of Claim
   * @member {String} claimId
   */
  exports.prototype['claimId'] = undefined;
  /**
   * Unique identifier of Contact who created record  Derived from calling context  SET ON SERVER
   * @member {String} createdById
   */
  exports.prototype['createdById'] = undefined;
  /**
   * UTC date and time at which record created  Set by server when creating record  SET ON SERVER
   * @member {Date} createdOn
   */
  exports.prototype['createdOn'] = undefined;
  /**
   * Serialised evidence data
   * @member {String} evidence
   */
  exports.prototype['evidence'] = undefined;
  /**
   * true if supplier has requested to do a 'live demo'  instead of submitting a file
   * @member {Boolean} hasRequestedLiveDemo
   */
  exports.prototype['hasRequestedLiveDemo'] = undefined;
  /**
   * unique identifier of binary file in blob storage system  NOTE:  this may not be a GUID eg it may be a URL  NOTE:  this is a GUID for SharePoint
   * @member {String} blobId
   */
  exports.prototype['blobId'] = undefined;



  return exports;
}));


