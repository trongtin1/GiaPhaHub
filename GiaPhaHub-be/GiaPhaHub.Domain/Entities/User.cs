using GiaPhaHub_be.Domain.Abstractions.Base;

namespace GiaPhaHub_be.Domain.Entities;

public class User : EntityTrackable<Guid>
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
}
