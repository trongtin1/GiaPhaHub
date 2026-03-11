using GiaPhaHub_be.Domain.Abstractions.Base;

namespace GiaPhaHub_be.Domain.Entities;

public class FamilyTree : EntityTrackable<int>
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }

    public ICollection<FamilyMember> Members { get; set; } = new List<FamilyMember>();
}