using GiaPhaHub_be.Application.Common;
using GiaPhaHub_be.Application.DTOs;
using GiaPhaHub_be.Domain.Models;

namespace GiaPhaHub_be.Application.IServices;

public interface IUserService
{
    Task<Result<PageList<UserResponse>>> GetAll(QueryResource queryResource);
    Task<Result<UserResponse>> GetById(string id);
    Task<Result<UserResponse>> Update(string id, UpdateUserRequest request);
    Task<Result<bool>> Delete(string id, bool isSoftDelete = true);
}
