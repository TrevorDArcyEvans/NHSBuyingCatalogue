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
    instance = new CatalogueApi.Contacts();
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

  describe('Contacts', function() {
    it('should create an instance of Contacts', function() {
      // uncomment below and update the code to test Contacts
      //var instance = new CatalogueApi.Contacts();
      //expect(instance).to.be.a(CatalogueApi.Contacts);
    });

    it('should have the property id (base name: "id")', function() {
      // uncomment below and update the code to test the property id
      //var instance = new CatalogueApi.Contacts();
      //expect(instance).to.be();
    });

    it('should have the property organisationId (base name: "organisationId")', function() {
      // uncomment below and update the code to test the property organisationId
      //var instance = new CatalogueApi.Contacts();
      //expect(instance).to.be();
    });

    it('should have the property firstName (base name: "firstName")', function() {
      // uncomment below and update the code to test the property firstName
      //var instance = new CatalogueApi.Contacts();
      //expect(instance).to.be();
    });

    it('should have the property lastName (base name: "lastName")', function() {
      // uncomment below and update the code to test the property lastName
      //var instance = new CatalogueApi.Contacts();
      //expect(instance).to.be();
    });

    it('should have the property emailAddress1 (base name: "emailAddress1")', function() {
      // uncomment below and update the code to test the property emailAddress1
      //var instance = new CatalogueApi.Contacts();
      //expect(instance).to.be();
    });

    it('should have the property phoneNumber1 (base name: "phoneNumber1")', function() {
      // uncomment below and update the code to test the property phoneNumber1
      //var instance = new CatalogueApi.Contacts();
      //expect(instance).to.be();
    });

  });

}));
