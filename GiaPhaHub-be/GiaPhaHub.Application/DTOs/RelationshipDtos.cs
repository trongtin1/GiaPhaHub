using System.ComponentModel.DataAnnotations;

namespace GiaPhaHub_be.Application.DTOs;

public class RelationshipRequest
{
    [Required]
    public int FromMemberId { get; set; }

    [Required]
    public int ToMemberId { get; set; }

    [Required]
    public int RelationshipTypeId { get; set; }
}

public class RelationshipResponse
{
    public int Id { get; set; }
    public int FromMemberId { get; set; }
    public int ToMemberId { get; set; }
    public int RelationshipTypeId { get; set; }
    public string? FromMemberName { get; set; }
    public string? ToMemberName { get; set; }
    public RelationshipTypeResponse? RelationshipType { get; set; }
}

public class KinshipInferenceRequest
{
    [Required]
    public int SourceMemberId { get; set; }

    [Required]
    public int TargetMemberId { get; set; }
}

public class KinshipInferenceResponse
{
    public int SourceId { get; set; }
    public int TargetId { get; set; }
    public string SourceCallLabel { get; set; } = string.Empty;
    public string TargetCallLabel { get; set; } = string.Empty;
    public string HumanReadable { get; set; } = string.Empty;
    public string ReverseHumanReadable { get; set; } = string.Empty;
    public bool IsBloodRelated { get; set; }
}
