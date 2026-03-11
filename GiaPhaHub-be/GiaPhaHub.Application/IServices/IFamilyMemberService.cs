using GiaPhaHub_be.Application.Common;
using GiaPhaHub_be.Application.DTOs;
using GiaPhaHub_be.Domain.Models;

namespace GiaPhaHub_be.Application.IServices;

public interface IFamilyMemberService
{
    Task<Result<PageList<FamilyMemberResponse>>> GetAll(QueryResource queryResource);
    Task<Result<FamilyMemberResponse>> GetById(int id);
    Task<Result<FamilyMemberResponse>> Create(CreateFamilyMemberRequest request);
    Task<Result<FamilyMemberResponse>> Update(int id, UpdateFamilyMemberRequest request);
    Task<Result<bool>> Delete(int id);
}
