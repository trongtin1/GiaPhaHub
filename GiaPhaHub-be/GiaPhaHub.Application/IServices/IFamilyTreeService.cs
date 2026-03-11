using GiaPhaHub_be.Application.Common;
using GiaPhaHub_be.Application.DTOs;
using GiaPhaHub_be.Domain.Models;

namespace GiaPhaHub_be.Application.IServices;

public interface IFamilyTreeService
{
    Task<Result<PageList<FamilyTreeResponse>>> GetAll(QueryResource queryResource);
    Task<Result<FamilyTreeResponse>> GetById(int id);
    Task<Result<FamilyTreeResponse>> Create(CreateFamilyTreeRequest request);
    Task<Result<FamilyTreeResponse>> Update(int id, UpdateFamilyTreeRequest request);
    Task<Result<bool>> Delete(int id);
}
