using System.ComponentModel.DataAnnotations;

namespace GiaPhaHub_be.Application.DTOs;

public class FamilyMemberRequest
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
    public int Generation { get; set; }
    public int? FatherId { get; set; }
    public int? MotherId { get; set; }
    public ICollection<int> Spouses { get; set; } = new List<int>();
    public ICollection<int> Children { get; set; } = new List<int>();

    public IDictionary<int, FamilyMemberResponse> Members { get; set; } =
      new Dictionary<int, FamilyMemberResponse>();
    public ICollection<MemberRelationshipDto> Relationships { get; set; } = new List<MemberRelationshipDto>();
}
public class MemberRelationshipDto
{
    public int MemberId { get; set; }
    public string MemberName { get; set; } = string.Empty;
    public string Relationship { get; set; } = string.Empty;
}