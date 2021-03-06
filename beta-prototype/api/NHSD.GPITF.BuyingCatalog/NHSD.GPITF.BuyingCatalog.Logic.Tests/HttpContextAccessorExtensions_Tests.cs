﻿using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Moq;
using NHSD.GPITF.BuyingCatalog.Models;
using NUnit.Framework;
using System.Security.Claims;

namespace NHSD.GPITF.BuyingCatalog.Logic.Tests
{
  [TestFixture]
  public sealed class HttpContextAccessorExtensions_Tests
  {
    private Mock<IHttpContextAccessor> _context;

    [SetUp]
    public void SetUp()
    {
      _context = new Mock<IHttpContextAccessor>();
    }

    [TestCase("NHS Digital")]
    [TestCase("216D2CB1-F5E4-4FD1-A0C9-3FA07AC3DE59")]
    public void ContextOrganisationId_Returns_Expected(string orgId)
    {
      var ctx = Creator.GetContext(orgId: orgId);
      _context.Setup(c => c.HttpContext).Returns(ctx);

      var ctxOrgId = _context.Object.ContextOrganisationId();

      ctxOrgId.Should().Be(orgId);
    }

    [TestCase(Roles.Admin)]
    [TestCase(Roles.Buyer)]
    [TestCase(Roles.Supplier)]
    public void HasRole_Returns_Expected(string role)
    {
      var ctx = Creator.GetContext(role: role);
      _context.Setup(c => c.HttpContext).Returns(ctx);

      var isAdmin = _context.Object.HasRole(role);

      isAdmin.Should().BeTrue();
    }
  }
}
