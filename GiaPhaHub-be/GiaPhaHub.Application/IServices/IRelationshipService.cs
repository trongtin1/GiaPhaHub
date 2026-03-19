using GiaPhaHub_be.Application.Common;
using GiaPhaHub_be.Application.DTOs;
using GiaPhaHub_be.Domain.Models;

namespace GiaPhaHub_be.Application.IServices;

public interface IRelationshipService
{
    Task<Result<PageList<RelationshipResponse>>> GetAll(QueryResource queryResource);
    Task<Result<RelationshipResponse>> GetById(int id);
    Task<Result<List<RelationshipResponse>>> GetByMemberId(int memberId);
    Task<Result<KinshipInferenceResponse>> InferKinship(KinshipInferenceRequest request);
    Task<Result<RelationshipResponse>> Create(RelationshipRequest request);
    Task<Result<RelationshipResponse>> Update(int id, RelationshipRequest request);
    Task<Result<bool>> Delete(int id);
}
