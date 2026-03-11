using GiaPhaHub_be.Domain.Abstractions.Base;

namespace GiaPhaHub_be.Domain.Entities;

public class Relationship : EntityTrackable<int>
{
    public int FromMemberId { get; set; }

    public int ToMemberId { get; set; }

    public int RelationshipTypeId { get; set; }

    public FamilyMember FromMember { get; set; } = null!;

    public FamilyMember ToMember { get; set; } = null!;

    public RelationshipType RelationshipType { get; set; } = null!;
}