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
    root.CatalogueApi.Frameworks = factory(root.CatalogueApi.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The Frameworks model module.
   * @module model/Frameworks
   * @version 1.0.0-private-beta
   */

  /**
   * Constructs a new <code>Frameworks</code>.
   * An agreement between an ‘organisation’ and NHS which allows a ‘solution’ to be purchased.  There may be more than one active or current ‘framework’ at any point in time  Note that a ‘framework’ has a link to zero or one previous ‘framework’  Generally, only interested in current ‘framework’
   * @alias module:model/Frameworks
   * @class
   * @param id {String} Unique identifier of entity
   */
  var exports = function(id) {
    var _this = this;

    _this['id'] = id;



  };

  /**
   * Constructs a <code>Frameworks</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/Frameworks} obj Optional instance to populate.
   * @return {module:model/Frameworks} The populated <code>Frameworks</code> instance.
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
      if (data.hasOwnProperty('name')) {
        obj['name'] = ApiClient.convertToType(data['name'], 'String');
      }
      if (data.hasOwnProperty('description')) {
        obj['description'] = ApiClient.convertToType(data['description'], 'String');
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
   * Name of Framework, as displayed to a user
   * @member {String} name
   */
  exports.prototype['name'] = undefined;
  /**
   * Description of Framework, as displayed to a user
   * @member {String} description
   */
  exports.prototype['description'] = undefined;



  return exports;
}));


