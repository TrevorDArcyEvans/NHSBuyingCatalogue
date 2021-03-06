# Authentication

All RESTful APIs require authentication, either by
[basic authentication](NHSD.GPITF.BuyingCatalog.Authentications.BasicAuthentication.yml) or
[OIDC bearer authentication](NHSD.GPITF.BuyingCatalog.Authentications.BearerAuthentication.yml).  Through the interfaces:  
 - [IBasicAuthentication](NHSD.GPITF.BuyingCatalog.Authentications.IBasicAuthentication.yml)
 - [IBearerAuthentication](NHSD.GPITF.BuyingCatalog.Authentications.IBearerAuthentication.yml)

Bearer tokens are cached so that we do not spam the OIDC provider.
This is done by the following caching entities:
- [IUserInfoResponseCache](NHSD.GPITF.BuyingCatalog.Interfaces.IUserInfoResponseCache.yml)
- [IUserInfoResponseRetriever](NHSD.GPITF.BuyingCatalog.Interfaces.IUserInfoResponseRetriever.yml)

Please note that _basic authentication_ is only enabled in _Development_ mode.  

