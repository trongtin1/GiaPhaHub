using System.Linq.Expressions;
using AutoMapper;
using GiaPhaHub_be.Application.Common;
using GiaPhaHub_be.Application.DTOs;
using GiaPhaHub_be.Application.Extensions;
using GiaPhaHub_be.Application.IServices;
using GiaPhaHub_be.Domain.Common;
using GiaPhaHub_be.Domain.Entities;
using GiaPhaHub_be.Domain.Models;

namespace GiaPhaHub_be.Application.Services;

public class RelationshipTypeService : BaseService, IRelationshipTypeService
{
    public RelationshipTypeService(IUnitOfWork unitOfWork, IMapper mapper)
        : base(unitOfWork, mapper)
    {
    }

    public async Task<Result<PageList<RelationshipTypeResponse>>> GetAll(QueryResource queryResource)
    {
        var pagingSpec = new PagingSpecification(queryResource);
        var columnsMap = new Dictionary<string, Expression<Func<RelationshipType, object>>>
        {
            ["name"] = x => x.Name
        };

        var items = await _unitOfWork.IRelationshipTypeRepository.FindAll(
            predicate: _ => true,
            orderBy: q => string.IsNullOrEmpty(queryResource.SortColumnBy)
                ? q.OrderBy(e => e.Id)
                : queryResource.IsSortColumnAscending
                    ? q.OrderBy(columnsMap[queryResource.SortColumnBy])
                    : q.OrderByDescending(columnsMap[queryResource.SortColumnBy]),
            pagingSpecification: pagingSpec
        );

        var result = items.MapToPageList<RelationshipType, RelationshipTypeResponse>(_mapper);
        return Success(result);
    }

    public async Task<Result<RelationshipTypeResponse>> GetById(int id)
    {
        var repo = _unitOfWork.IRelationshipTypeRepository;
        var type = await repo.FindSingle(t => t.Id == id);

        if (type is null)
            return NotFound<RelationshipTypeResponse>($"Không tìm thấy loại quan hệ có Id = {id}.");
        var response = _mapper.Map<RelationshipTypeResponse>(type);
        return Success(response);
    }

    public async Task<Result<RelationshipTypeResponse>> Create(CreateRelationshipTypeRequest request)
    {
        var repo = _unitOfWork.IRelationshipTypeRepository;
        var type = _mapper.Map<RelationshipType>(request);

        await repo.Add(type);
        await _unitOfWork.SaveChangesAsync();

        var response = _mapper.Map<RelationshipTypeResponse>(type);
        return Created(response);
    }

    public async Task<Result<RelationshipTypeResponse>> Update(int id, UpdateRelationshipTypeRequest request)
    {
        var repo = _unitOfWork.IRelationshipTypeRepository;
        var type = await repo.FindSingle(t => t.Id == id);

        if (type is null)
            return NotFound<RelationshipTypeResponse>($"Không tìm thấy loại quan hệ có Id = {id}.");

        _mapper.Map(request, type);
        repo.Update(type);
        await _unitOfWork.SaveChangesAsync();

        var response = _mapper.Map<RelationshipTypeResponse>(type);
        return Success(response);
    }

    public async Task<Result<bool>> Delete(int id)
    {
        var repo = _unitOfWork.IRelationshipTypeRepository;
        var type = await repo.FindSingle(t => t.Id == id);

        if (type is null)
            return NotFound<bool>($"Không tìm thấy loại quan hệ có Id = {id}.");

        repo.Remove(type);
        await _unitOfWork.SaveChangesAsync();

        var response = _mapper.Map<RelationshipTypeResponse>(type);
        return Success(true, "Xoá loại quan hệ thành công.");
    }
}
