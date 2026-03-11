using System.ComponentModel.DataAnnotations;

namespace GiaPhaHub_be.Application.DTOs;

public class CreateFamilyMemberRequest
{
    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    public string Gender { get; set; } = string.Empty;

    [Required]
    public DateTime BirthDate { get; set; }

    public DateTime? DeathDate { get; set; }
    public string? Avatar { get; set; }
    public string? Phone { get; set; }
    public string? Address { get; set; }
    public string? Bio { get; set; }
    public int? ParentId { get; set; }
    public int? SpouseId { get; set; }
    public string? SpouseRelationship { get; set; }

    [Required]
    public int Generation { get; set; }
}

public class UpdateFamilyMemberRequest
{
    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    public string Gender { get; set; } = string.Empty;

    [Required]
    public DateTime BirthDate { get; set; }

    public DateTime? DeathDate { get; set; }
    public string? Avatar { get; set; }
    public string? Phone { get; set; }
    public string? Address { get; set; }
    public string? Bio { get; set; }
    public int? ParentId { get; set; }
    public int? SpouseId { get; set; }
    public string? SpouseRelationship { get; set; }

    [Required]
    public int Generation { get; set; }
}

public class FamilyMemberResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Gender { get; set; } = string.Empty;
    public DateTime BirthDate { get; set; }
    public DateTime? DeathDate { get; set; }
    public string? Avatar { get; set; }
    public string? Phone { get; set; }
    public string? Address { get; set; }
    public string? Bio { get; set; }
    public int? ParentId { get; set; }
    public int? SpouseId { get; set; }
    public string? SpouseRelationship { get; set; }
    public int Generation { get; set; }
}
