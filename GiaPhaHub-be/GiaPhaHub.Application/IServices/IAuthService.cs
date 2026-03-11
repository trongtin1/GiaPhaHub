using GiaPhaHub_be.Application.Common;
using GiaPhaHub_be.Application.DTOs;

namespace GiaPhaHub_be.Application.IServices;

public interface IAuthService
{
    Task<Result<AuthResponse>> Register(RegisterRequest request, HttpContext httpContext);
    Task<Result<AuthResponse>> Login(LoginRequest request, HttpContext httpContext);
    Task<Result<AuthResponse>> RefreshToken(HttpContext httpContext);
    Task<Result<bool>> Logout(HttpContext httpContext);
}
