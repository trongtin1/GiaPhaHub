using GiaPhaHub_be.Domain.Abstractions.Base;

namespace GiaPhaHub_be.Domain.Entities;

public class FamilyMember : EntityTrackable<int>
{
    public string Name { get; set; } = string.Empty;

    public string Gender { get; set; } = string.Empty;

    public DateTime BirthDate { get; set; }

    public DateTime? DeathDate { get; set; }

    public string? Avatar { get; set; }

    public string? Phone { get; set; }

    public string? Address { get; set; }

    public string? Bio { get; set; }
    public int Generation { get; set; }

    // thuộc cây gia phả nào
    public int FamilyTreeId { get; set; }

    public FamilyTree FamilyTree { get; set; } = null!;

    // relationship graph
    public ICollection<Relationship> FromRelationships { get; set; } = new List<Relationship>();

    public ICollection<Relationship> ToRelationships { get; set; } = new List<Relationship>();
}