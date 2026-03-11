using System.ComponentModel.DataAnnotations;

namespace GiaPhaHub_be.Application.DTOs;

public class CreateFamilyTreeRequest
{
    [Required, MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }
}

public class UpdateFamilyTreeRequest
{
    [Required, MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }
}

public class FamilyTreeResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTimeOffset CreateDate { get; set; }
    public DateTimeOffset ModifiedDate { get; set; }
}
