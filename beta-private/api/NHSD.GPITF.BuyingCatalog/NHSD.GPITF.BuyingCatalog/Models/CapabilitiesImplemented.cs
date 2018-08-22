using Dapper.Contrib.Extensions;
using System.ComponentModel.DataAnnotations;

namespace NHSD.GPITF.BuyingCatalog.Models
{
  /// <summary>
  /// A ‘capability’ which a ‘solution’ asserts that it provides.
  /// This is then assessed by NHS to verify the ‘solution’ complies with the ‘capability’ it has claimed.
  /// </summary>
  [Table(nameof(CapabilitiesImplemented))]
  public sealed class CapabilitiesImplemented
  {
    /// <summary>
    /// Unique identifier of entity
    /// </summary>
    [Required]
    [ExplicitKey]
    public string Id { get; set; }

    /// <summary>
    /// Unique identifier of solution
    /// </summary>
    [Required]
    public string SolutionId { get; set; }

    /// <summary>
    /// Unique identifier of capability
    /// </summary>
    [Required]
    public string CapabilityId { get; set; }

    /// <summary>
    /// Current status of this ClaimedCapability
    /// </summary>
    public ClaimedCapabilityStatus Status { get; set; } = ClaimedCapabilityStatus.Submitted;
  }
}
