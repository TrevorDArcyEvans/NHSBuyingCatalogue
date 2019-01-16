﻿#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member
using Gif.Service.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Newtonsoft.Json.Linq;
using Samc4.CipherUtil;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Cryptography;
using System.Text;
using Gif.Service.Enums;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace Gif.Service.Crm
{
    public sealed class Repository : IRepository
    {
        private readonly AuthenticationResult _authResult;
        private readonly IConfiguration _config;
        private readonly ILogger<Repository> _logger;
        private readonly bool _logCRM;
        private HttpClient _httpClient;


        public Repository(
          IConfiguration config,
          ILogger<Repository> logger)
        {
            _config = config;
            _logger = logger;
            _logCRM = Settings.LOG_CRM(config);

            var secret = CipherUtil.Decrypt<AesManaged>(Settings.GIF_ENCRYPTED_CLIENT_SECRET(_config), "GifService", Settings.GIF_AZURE_CLIENT_ID(_config));
            var authContext = new AuthenticationContext(Settings.GIF_CRM_AUTHORITY(_config), false);
            _authResult = authContext.AcquireTokenAsync(Settings.GIF_CRM_URL(_config), new ClientCredential(Settings.GIF_AZURE_CLIENT_ID(_config), secret)).Result;

            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;

            CreateCrmConnection();
        }

        private HttpClient CreateCrmConnection()
        {

            var httpHandler = new HttpClientHandler { Proxy = null, UseProxy = false };

            _httpClient = new HttpClient(httpHandler)
            {
                BaseAddress = new Uri(Settings.GIF_CRM_URL(_config) + "/api/data/v9.0/"),
                Timeout = new TimeSpan(0, 2, 0)
            };
            _httpClient.DefaultRequestHeaders.Add("OData-MaxVersion", "4.0");
            _httpClient.DefaultRequestHeaders.Add("OData-Version", "4.0");
            _httpClient.DefaultRequestHeaders.Add("Prefer", "odata.include-annotations=OData.Community.Display.V1.FormattedValue");
            _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _authResult.AccessToken);

            return _httpClient;
        }

        public JObject Retrieve(string query)
        {
            LogInformation($"[{nameof(Retrieve)}] --> {query}");

            LogInformation($"[{nameof(RetrieveMultiple)}] --> before call to CRM");
            var httpResponse = _httpClient.GetAsync(query).Result;
            LogInformation($"[{nameof(RetrieveMultiple)}] --> after call to CRM");

            JObject jretrieveJObject = null;

            if (httpResponse.IsSuccessStatusCode)
            {
                jretrieveJObject = JObject.Parse(httpResponse.Content.ReadAsStringAsync().Result);
            }
            else
            {
                throw new CrmApiException(httpResponse.ReasonPhrase, httpResponse.StatusCode);
            }

            return jretrieveJObject;
        }

        public JToken RetrieveMultiple(string query, out int? count)
        {
            var stopwatch = new Stopwatch();
            LogInformation($"[{nameof(RetrieveMultiple)}] --> {query}");

            JToken jretrieveToken = null;
            count = null;

            HttpResponseMessage retrieveResponse;

            LogInformation($"[{nameof(RetrieveMultiple)}] --> before call to CRM");
            stopwatch.Start();
            retrieveResponse = _httpClient.GetAsync(query).Result;
            stopwatch.Stop();
            LogInformation($"[{nameof(RetrieveMultiple)}] --> after call to CRM. It took {stopwatch.ElapsedMilliseconds}ms.");


            if (retrieveResponse.StatusCode != HttpStatusCode.OK && retrieveResponse.StatusCode != HttpStatusCode.NoContent)
                throw new CrmApiException(retrieveResponse.ReasonPhrase, retrieveResponse.StatusCode);

            LogInformation($"Deserialsing...");
            stopwatch.Reset();
            stopwatch.Start();
            var jretrieveJObject = JObject.Parse(retrieveResponse.Content.ReadAsStringAsync().Result);
            stopwatch.Stop();
            LogInformation($"Finished deserialising in {stopwatch.ElapsedMilliseconds}");
            stopwatch.Reset();
            stopwatch.Start();

            if (jretrieveJObject == null)
                return jretrieveToken;

            jretrieveToken = jretrieveJObject["value"];

            if (jretrieveJObject["@odata.count"] != null)
            {
                count = int.Parse(jretrieveJObject["@odata.count"].ToString());
            }

            stopwatch.Stop();
            LogInformation($"Leaving [{nameof(RetrieveMultiple)}] ,  {stopwatch.ElapsedMilliseconds}");
            return jretrieveToken;
        }

        public void Associate(Guid entityId1, string entityName1, Guid entityId2, string entityName2, string relationshipKey)
        {
            LogInformation($"[{nameof(Associate)}] --> {entityName1}/{entityId1} -> [{relationshipKey}] -> {entityName2}/{entityId2}");

            HttpResponseMessage resp;

            var address = $"{entityName1}({entityId1.ToString()})/{relationshipKey}/$ref";
            var associated = $"{{\"@odata.id\":\"{_httpClient.BaseAddress}{entityName2}({entityId2})\"}}";
            var content = new StringContent(associated, Encoding.UTF8, "application/json");

            resp = _httpClient.PostAsync(address, content).Result;

            if (resp.StatusCode != HttpStatusCode.OK && resp.StatusCode != HttpStatusCode.NoContent)
                throw new CrmApiException(resp.ReasonPhrase, resp.StatusCode);
        }

        public Guid CreateEntity(string entityName, string entityData, bool update = false)
        {
            LogInformation($"[{nameof(CreateEntity)}] --> {entityName}/{entityData}");

            var address = entityName;
            var content = new StringContent(entityData, Encoding.UTF8, "application/json");

            HttpResponseMessage updateResponse;
            string targetUri;

            updateResponse = _httpClient.PostAsync(address, content).Result;
            targetUri = _httpClient.BaseAddress.AbsoluteUri;


            if (updateResponse.StatusCode != HttpStatusCode.OK && updateResponse.StatusCode != HttpStatusCode.NoContent)
                throw new CrmApiException(updateResponse.ReasonPhrase, updateResponse.StatusCode);

            IEnumerable<string> headerVals;

            if (!updateResponse.Headers.TryGetValues("OData-EntityId", out headerVals))
            {
                throw new FormatException("Response Entity ID header is empty");
            }

            var idString = new List<string>(headerVals)[0].Replace(targetUri + entityName, "");

            return Guid.Parse(idString);
        }

        public void UpdateEntity(string entityName, Guid id, string entityData)
        {
            LogInformation($"[{nameof(UpdateEntity)}] --> {entityName}/{entityData}");

            HttpResponseMessage response;
            var method = new HttpMethod("PATCH");
            var content = new StringContent(entityData, Encoding.UTF8, "application/json");


            var requestUri = new Uri($"{_httpClient.BaseAddress.AbsoluteUri}{entityName}({id})");

            var request = new HttpRequestMessage(method, requestUri)
            {
                Content = content
            };

            response = _httpClient.SendAsync(request).Result;


            if (response.StatusCode != HttpStatusCode.NoContent)
                throw new CrmApiException(response.ReasonPhrase, response.StatusCode);

        }

        public void Delete(string entityName, Guid id)
        {
            LogInformation($"[{nameof(Delete)}] --> {entityName}/{id}");

            HttpResponseMessage response;
            var method = new HttpMethod("DELETE");


            var requestUri = new Uri($"{_httpClient.BaseAddress.AbsoluteUri}{entityName}({id})");

            var request = new HttpRequestMessage(method, requestUri);
            response = _httpClient.SendAsync(request).Result;

            if (response.StatusCode != HttpStatusCode.NoContent)
                throw new CrmApiException(response.ReasonPhrase, response.StatusCode);
        }

        public void CreateBatch(List<BatchData> batchData)
        {
            LogInformation($"[{nameof(CreateBatch)}] --> {JsonConvert.SerializeObject(batchData)}");

            HttpResponseMessage response;

            // batch setup
            var batchId = Guid.NewGuid();
            var deleteChangeId = Guid.NewGuid();
            var patchChangeId = Guid.NewGuid();
            var batchUrl = new Uri($"{_httpClient.BaseAddress.AbsoluteUri}$batch");

            var batchRequest = new HttpRequestMessage(HttpMethod.Post, batchUrl);
            var batchContent = new MultipartContent("mixed", "batch_" + batchId);

            // changeset setup
            var deleteChange = new MultipartContent("mixed", "changeset_" + deleteChangeId);
            var patchChange = new MultipartContent("mixed", "changeset_" + patchChangeId);

            //Add deletes first in their own changeset to avoid issues with upserts in following changesets
            AddChangeSet(batchData.Where(x => x.Type == BatchTypeEnum.Delete).ToList(), _httpClient, ref deleteChange);
            AddChangeSet(batchData.Where(x => x.Type != BatchTypeEnum.Delete).ToList(), _httpClient, ref patchChange);

            //Add headers add changeset level
            AddHeadersToChangeSets(ref deleteChange);
            AddHeadersToChangeSets(ref patchChange);

            // Add the changesets to the batch content
            batchContent.Add(deleteChange);
            batchContent.Add(patchChange);

            // send batch
            batchRequest.Content = batchContent;
            response = _httpClient.SendAsync(batchRequest).Result;

            if (response.StatusCode != HttpStatusCode.OK)
                throw new CrmApiException(response.ReasonPhrase, response.StatusCode);

        }

        private void AddChangeSet(IList<BatchData> batchData, HttpClient httpClient, ref MultipartContent changeSet)
        {
            var count = 1;

            foreach (var batch in batchData)
            {
                var content = new StringContent(batch.EntityData, Encoding.UTF8, "application/json");
                var requestUri = new Uri($"{httpClient.BaseAddress.AbsoluteUri}{batch.Name}({batch.Id})");
                content.Headers.Remove("Content-Type");
                content.Headers.Add("Content-Type", "application/json;type=entry");
                content.Headers.Add("Content-Transfer-Encoding", "binary");
                content.Headers.Add("Content-Id", count.ToString());

                var method = batch.Type == BatchTypeEnum.Delete ?
                    new HttpMethod("DELETE") : new HttpMethod("PATCH");

                var request = new HttpRequestMessage(method, requestUri)
                {
                    Content = content
                };

                // Add this content to the changeset
                changeSet.Add(new HttpMessageContent(request));
                count++;
            }
        }

        private void AddHeadersToChangeSets(ref MultipartContent content)
        {
            using (var enumChangeSet = content.GetEnumerator())
            {
                while (enumChangeSet.MoveNext())
                {
                    var currentChangeSet = enumChangeSet.Current;
                    currentChangeSet.Headers.ContentType = new MediaTypeHeaderValue("application/http");
                    currentChangeSet.Headers.Add("Content-Transfer-Encoding", "binary");
                }
            }
        }

        private void UpdateField(string entityName, string entityField, Guid entityId, string value)
        {
            var address = entityName + "(" + entityId + ")/" + entityField;

            //Don't add quotes if value is a bool/int
            bool boolField; int intField; string updateBody;
            if (bool.TryParse(value, out boolField) || int.TryParse(value, out intField))
            {
                updateBody = "{\"value\": " + value.ToLower() + "}";
            }
            else
            {
                updateBody = "{\"value\":\"" + value.ToLower() + "\"}";
            }

            var content = new StringContent(updateBody, Encoding.UTF8, "application/json");

            HttpResponseMessage updateResponse;

            updateResponse = _httpClient.PutAsync(address, content).Result;

            if (updateResponse.StatusCode != HttpStatusCode.NoContent)
                throw new CrmApiException(updateResponse.ReasonPhrase, updateResponse.StatusCode);
        }

        private void LogInformation(string msg)
        {
            if (_logCRM)
            {
                _logger.LogInformation(msg);
            }
        }

        private void StopWatchToggle()
        {

        }

    }



}
#pragma warning restore CS1591 // Missing XML comment for publicly visible type or member
