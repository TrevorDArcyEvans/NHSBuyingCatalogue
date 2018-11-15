﻿using FluentValidation;
using Microsoft.AspNetCore.Http;
using NHSD.GPITF.BuyingCatalog.Interfaces;
using NHSD.GPITF.BuyingCatalog.Models;
using System;
using System.Collections.Generic;

namespace NHSD.GPITF.BuyingCatalog.Logic
{
  public abstract class ReviewsLogicBase<T> : LogicBase where T : ReviewsBase
  {
    private readonly IReviewsDatastore<T> _datastore;
    private readonly IContactsDatastore _contacts;
    private readonly IReviewsValidator<T> _validator;
    private readonly IReviewsFilter<IEnumerable<T>> _filter;

    public ReviewsLogicBase(
      IReviewsDatastore<T> datastore,
      IContactsDatastore contacts,
      IReviewsValidator<T> validator,
      IReviewsFilter<IEnumerable<T>> filter,
      IHttpContextAccessor context) :
      base(context)
    {
      _datastore = datastore;
      _contacts = contacts;
      _validator = validator;
      _filter = filter;
    }

    public IEnumerable<IEnumerable<T>> ByEvidence(string evidenceId)
    {
      return _filter.Filter(_datastore.ByEvidence(evidenceId));
    }

    public T Create(T review)
    {
      _validator.ValidateAndThrow(review, ruleSet: nameof(IReviewsLogic<T>.Create));

      var email = Context.Email();
      review.CreatedById = _contacts.ByEmail(email).Id;
      review.CreatedOn = DateTime.UtcNow;
      return _datastore.Create(review);
    }
  }
}
