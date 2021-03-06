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
    root.CatalogueApi.OptionalStandard = factory(root.CatalogueApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The OptionalStandard model module.
   * @module model/OptionalStandard
   * @version 1.0.0-private-beta
   */

  /**
   * Constructs a new <code>OptionalStandard</code>.
   * A Standard and a flag associated with a Capability through a CapabilityMapping
   * @alias module:model/OptionalStandard
   * @class
   * @param standardId {String} Unique identifier of Standard
   */
  var exports = function(standardId) {
    var _this = this;

    _this['standardId'] = standardId;

  };

  /**
   * Constructs a <code>OptionalStandard</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/OptionalStandard} obj Optional instance to populate.
   * @return {module:model/OptionalStandard} The populated <code>OptionalStandard</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('standardId')) {
        obj['standardId'] = ApiClient.convertToType(data['standardId'], 'String');
      }
      if (data.hasOwnProperty('isOptional')) {
        obj['isOptional'] = ApiClient.convertToType(data['isOptional'], 'Boolean');
      }
    }
    return obj;
  }

  /**
   * Unique identifier of Standard
   * @member {String} standardId
   */
  exports.prototype['standardId'] = undefined;
  /**
   * True if the Standard does not have to be supported in order to support the Capability
   * @member {Boolean} isOptional
   */
  exports.prototype['isOptional'] = undefined;



  return exports;
}));


