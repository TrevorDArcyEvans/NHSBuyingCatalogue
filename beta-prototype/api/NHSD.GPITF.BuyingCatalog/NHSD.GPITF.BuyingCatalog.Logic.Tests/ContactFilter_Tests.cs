﻿using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Moq;
using NHSD.GPITF.BuyingCatalog.Interfaces;
using NHSD.GPITF.BuyingCatalog.Models;
using NUnit.Framework;
using System;
using System.Linq;

namespace NHSD.GPITF.BuyingCatalog.Logic.Tests
{
  [TestFixture]
  public sealed class ContactFilter_Tests
  {
    private Mock<IHttpContextAccessor> _context;
    private Mock<IOrganisationDatastore> _organisationDatastore;

    [SetUp]
    public void SetUp()
    {
      _context = new Mock<IHttpContextAccessor>();
      _organisationDatastore = new Mock<IOrganisationDatastore>();
    }

    [Test]
    public void Constructor_Completes()
    {
      Assert.DoesNotThrow(() => new ContactFilter(_context.Object, _organisationDatastore.Object));
    }

    [TestCase(Roles.Admin)]
    [TestCase(Roles.Buyer)]
    public void Filter_NonSupplier_Returns_All(string role)
    {
      var ctx = Creator.GetContext(role: role);
      _context.Setup(c => c.HttpContext).Returns(ctx);
      var filter = new ContactFilter(_context.Object, _organisationDatastore.Object);
      var contacts = new[]
      {
        GetContact(),
        GetContact(),
        GetContact()
      };
      var res = filter.Filter(contacts.AsQueryable());

      res.Should().BeEquivalentTo(contacts);
    }

    [Test]
    public void Filter_Supplier_Returns_OwnNHSD()
    {
      var orgId = Guid.NewGuid().ToString();
      var org = Creator.GetOrganisation(id: orgId, primaryRoleId: PrimaryRole.ApplicationServiceProvider);
      _organisationDatastore.Setup(x => x.ById(orgId)).Returns(org);

      var otherOrgId = Guid.NewGuid().ToString();
      var otherOrg = Creator.GetOrganisation(id: otherOrgId, primaryRoleId: PrimaryRole.ApplicationServiceProvider);
      _organisationDatastore.Setup(x => x.ById(otherOrgId)).Returns(otherOrg);

      var nhsdOrgId = Guid.NewGuid().ToString();
      var nhsd = Creator.GetOrganisation(id: nhsdOrgId, primaryRoleId: PrimaryRole.GovernmentDepartment);
      _organisationDatastore.Setup(x => x.ById(nhsdOrgId)).Returns(nhsd);

      var ctx = Creator.GetContext(orgId: orgId, role: Roles.Supplier);
      _context.Setup(c => c.HttpContext).Returns(ctx);

      var filter = new ContactFilter(_context.Object, _organisationDatastore.Object);
      var cont1 = GetContact(orgId: orgId);
      var cont2 = GetContact(orgId: orgId);
      var cont3 = GetContact(orgId: otherOrgId);
      var cont4 = GetContact(orgId: nhsdOrgId);
      var contacts = new[] { cont1, cont2, cont3, cont4 };


      var res = filter.Filter(contacts.AsQueryable());


      res.Should().BeEquivalentTo(new[] { cont1, cont2, cont4 });
    }

    private static Contact GetContact(
      string id = null,
      string orgId = null)
    {
      return new Contact
      {
        Id = id ?? Guid.NewGuid().ToString(),
        OrganisationId = orgId ?? Guid.NewGuid().ToString()
      };
    }
  }
}
