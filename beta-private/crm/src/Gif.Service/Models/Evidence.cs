#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member
using Gif.Service.Attributes;
using Newtonsoft.Json.Linq;
using System;
using System.Runtime.Serialization;

namespace Gif.Service.Models
{
    [CrmEntity("cc_evidences")]
    [DataContract]
    public class Evidence : EntityBase
    {

        [DataMember]
        [CrmIdField]
        [CrmFieldName("cc_evidenceid")]
        public Guid Id { get; set; }

        [DataMember]
        [CrmFieldName("cc_name")]
        public string Name { get; set; }

        [DataMember]
        [CrmFieldName("_cc_capabilityimplemented_value")]
        [CrmFieldNameDataBind("cc_CapabilityImplemented@odata.bind")]
        [CrmFieldEntityDataBind("cc_capabilityimplementeds")]
        public Guid? ClaimId { get; set; }

        [DataMember]
        [CrmFieldName("_cc_standardapplicable_value")]
        [CrmFieldNameDataBind("cc_StandardApplicable@odata.bind")]
        [CrmFieldEntityDataBind("cc_standardapplicables")]
        public Guid? StandardApplicableId { get; set; }

        [DataMember]
        [CrmFieldName("_cc_createdbyid_value")]
        [CrmFieldNameDataBind("cc_CreatedByID@odata.bind")]
        [CrmFieldEntityDataBind("contacts")]
        public Guid CreatedById { get; set; }

        [DataMember]
        [CrmFieldName("_cc_previousversion_value")]
        [CrmFieldNameDataBind("cc_PreviousVersion@odata.bind")]
        [CrmFieldEntityDataBind("cc_evidences")]
        public Guid? PreviousId { get; set; }

        public int Order { get; set; }

        public Evidence() { }

        public Evidence(JToken token) : base(token)
        {
        }
    }
}
#pragma warning restore CS1591 // Missing XML comment for publicly visible type or member
