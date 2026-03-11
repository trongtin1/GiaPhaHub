using System.ComponentModel.DataAnnotations;

namespace GiaPhaHub_be.Application.DTOs;

public class UpdateUserRequest
{
    [Required, MaxLength(100)]
    public string FullName { get; set; } = string.Empty;

    [Required, EmailAddress, MaxLength(256)]
    public string Email { get; set; } = string.Empty;
}

public class UserResponse
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateTimeOffset CreateDate { get; set; }
    public DateTimeOffset ModifiedDate { get; set; }
}
