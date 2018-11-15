﻿using Gif.Service.Models;
using System.Collections.Generic;

namespace Gif.Service.Contracts
{
#pragma warning disable CS1591
    public interface ITechnicalContactsDatastore
    {
        IEnumerable<TechnicalContact> BySolution(string solutionId);
        TechnicalContact Create(TechnicalContact techCont);
        void Update(TechnicalContact techCont);
        void Delete(TechnicalContact techCont);
    }
#pragma warning restore CS1591
}
