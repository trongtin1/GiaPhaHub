using GiaPhaHub_be.Application.Common;
using GiaPhaHub_be.Application.DTOs;
using GiaPhaHub_be.Domain.Models;

namespace GiaPhaHub_be.Application.IServices;

public interface IFamilyMemberService
{
    Task<Result<PageList<FamilyMemberResponse>>> GetAll(QueryResource queryResource);
    Task<Result<FamilyMemberResponse>> GetTreeByRootId(int rootId);
    Task<Result<FamilyMemberResponse>> GetById(int id);
    Task<Result<FamilyMemberResponse>> Create(FamilyMemberRequest request);
    Task<Result<FamilyMemberResponse>> Update(int id, FamilyMemberRequest request);
    Task<Result<bool>> Delete(int id);
}
