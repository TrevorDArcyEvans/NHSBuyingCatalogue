﻿using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using NHSD.GPITF.BuyingCatalog.Datastore.CRM.Interfaces;
using NHSD.GPITF.BuyingCatalog.Interfaces;
using NHSD.GPITF.BuyingCatalog.Models;
using NUnit.Framework;
using System;

namespace NHSD.GPITF.BuyingCatalog.Datastore.CRM.Tests
{
  [TestFixture]
  public sealed class ClaimsDatastoreBase_Tests
  {
    private Mock<IRestClientFactory> _crmConnectionFactory;
    private Mock<ILogger<ClaimsDatastoreBase<ClaimsBase>>> _logger;
    private Mock<ISyncPolicyFactory> _policy;

    [SetUp]
    public void SetUp()
    {
      _crmConnectionFactory = new Mock<IRestClientFactory>();
      _logger = new Mock<ILogger<ClaimsDatastoreBase<ClaimsBase>>>();
      _policy = new Mock<ISyncPolicyFactory>();
    }

    [Test]
    public void Constructor_Completes()
    {
      Assert.DoesNotThrow(() => new DummyClaimsDatastoreBase(_crmConnectionFactory.Object, _logger.Object, _policy.Object));
    }

    [Test]
    public void Class_Implements_Interface()
    {
      var obj = new DummyClaimsDatastoreBase(_crmConnectionFactory.Object, _logger.Object, _policy.Object);

      var implInt = obj as IClaimsDatastore<ClaimsBase>;

      implInt.Should().NotBeNull();
    }
  }
}
