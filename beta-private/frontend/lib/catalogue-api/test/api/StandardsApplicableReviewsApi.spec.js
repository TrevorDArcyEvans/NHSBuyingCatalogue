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
    // AMD.
    define(['expect.js', '../../src/index'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    factory(require('expect.js'), require('../../src/index'));
  } else {
    // Browser globals (root is window)
    factory(root.expect, root.CatalogueApi);
  }
}(this, function(expect, CatalogueApi) {
  'use strict';

  var instance;

  beforeEach(function() {
    instance = new CatalogueApi.StandardsApplicableReviewsApi();
  });

  var getProperty = function(object, getter, property) {
    // Use getter method if present; otherwise, get the property directly.
    if (typeof object[getter] === 'function')
      return object[getter]();
    else
      return object[property];
  }

  var setProperty = function(object, setter, property, value) {
    // Use setter method if present; otherwise, set the property directly.
    if (typeof object[setter] === 'function')
      object[setter](value);
    else
      object[property] = value;
  }

  describe('StandardsApplicableReviewsApi', function() {
    describe('apiStandardsApplicableReviewsByEvidenceByEvidenceIdGet', function() {
      it('should call apiStandardsApplicableReviewsByEvidenceByEvidenceIdGet successfully', function(done) {
        //uncomment below and update the code to test apiStandardsApplicableReviewsByEvidenceByEvidenceIdGet
        //instance.apiStandardsApplicableReviewsByEvidenceByEvidenceIdGet(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
    describe('apiStandardsApplicableReviewsPost', function() {
      it('should call apiStandardsApplicableReviewsPost successfully', function(done) {
        //uncomment below and update the code to test apiStandardsApplicableReviewsPost
        //instance.apiStandardsApplicableReviewsPost(function(error) {
        //  if (error) throw error;
        //expect().to.be();
        //});
        done();
      });
    });
  });

}));
