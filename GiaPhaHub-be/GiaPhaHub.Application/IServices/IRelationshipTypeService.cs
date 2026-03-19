using GiaPhaHub_be.Application.Common;
using GiaPhaHub_be.Application.DTOs;
using GiaPhaHub_be.Domain.Models;

namespace GiaPhaHub_be.Application.IServices;

public interface IRelationshipTypeService
{
    Task<Result<PageList<RelationshipTypeResponse>>> GetAll(QueryResource queryResource);
    Task<Result<RelationshipTypeResponse>> GetById(int id);
    Task<Result<RelationshipTypeResponse>> Create(RelationshipTypeRequest request);
    Task<Result<RelationshipTypeResponse>> Update(int id, RelationshipTypeRequest request);
    Task<Result<bool>> Delete(int id);
}
