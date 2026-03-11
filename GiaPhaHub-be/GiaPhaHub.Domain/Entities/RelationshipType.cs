namespace GiaPhaHub_be.Domain.Entities;

public class RelationshipType
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public ICollection<Relationship> Relationships { get; set; } = new List<Relationship>();
}