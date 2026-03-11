using System.ComponentModel.DataAnnotations;

namespace GiaPhaHub_be.Application.DTOs;

public class CreateRelationshipRequest
{
    [Required]
    public int FromMemberId { get; set; }

    [Required]
    public int ToMemberId { get; set; }

    [Required]
    public int RelationshipTypeId { get; set; }
}

public class UpdateRelationshipRequest
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
    public string? RelationshipTypeName { get; set; }
}
