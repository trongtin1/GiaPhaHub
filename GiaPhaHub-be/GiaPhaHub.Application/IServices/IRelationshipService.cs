using GiaPhaHub_be.Application.Common;
using GiaPhaHub_be.Application.DTOs;
using GiaPhaHub_be.Domain.Models;

namespace GiaPhaHub_be.Application.IServices;

public interface IRelationshipService
{
    Task<Result<PageList<RelationshipResponse>>> GetAll(QueryResource queryResource);
    Task<Result<RelationshipResponse>> GetById(int id);
    Task<Result<List<RelationshipResponse>>> GetByMemberId(int memberId);
    Task<Result<RelationshipResponse>> Create(CreateRelationshipRequest request);
    Task<Result<RelationshipResponse>> Update(int id, UpdateRelationshipRequest request);
    Task<Result<bool>> Delete(int id);
}
