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

public class FamilyTreeService : BaseService, IFamilyTreeService
{
    public FamilyTreeService(IUnitOfWork unitOfWork, IMapper mapper)
        : base(unitOfWork, mapper)
    {
    }

    public async Task<Result<PageList<FamilyTreeResponse>>> GetAll(QueryResource queryResource)
    {
        var pagingSpec = new PagingSpecification(queryResource);
        var columnsMap = new Dictionary<string, Expression<Func<FamilyTree, object>>>
        {
            ["name"] = x => x.Name,
            ["createdate"] = x => x.CreateDate
        };

        var items = await _unitOfWork.IFamilyTreeRepository.FindAll(
            predicate: t => t.IsDelete == false,
            orderBy: q => string.IsNullOrEmpty(queryResource.SortColumnBy)
                ? q.OrderBy(e => e.Id)
                : queryResource.IsSortColumnAscending
                    ? q.OrderBy(columnsMap[queryResource.SortColumnBy])
                    : q.OrderByDescending(columnsMap[queryResource.SortColumnBy]),
            pagingSpecification: pagingSpec
        );

        var result = items.MapToPageList<FamilyTree, FamilyTreeResponse>(_mapper);
        return Success(result);
    }

    public async Task<Result<FamilyTreeResponse>> GetById(int id)
    {
        var repo = _unitOfWork.IFamilyTreeRepository;
        var tree = await repo.FindSingle(t => t.Id == id && t.IsDelete == false);

        if (tree is null)
            return NotFound<FamilyTreeResponse>($"Không tìm thấy gia phả có Id = {id}.");
        var response = _mapper.Map<FamilyTreeResponse>(tree);
        return Success(response);
    }

    public async Task<Result<FamilyTreeResponse>> Create(CreateFamilyTreeRequest request)
    {
        var repo = _unitOfWork.IFamilyTreeRepository;
        var tree = _mapper.Map<FamilyTree>(request);

        await repo.Add(tree);
        await _unitOfWork.SaveChangesAsync();

        var response = _mapper.Map<FamilyTreeResponse>(tree);
        return Created(response);
    }

    public async Task<Result<FamilyTreeResponse>> Update(int id, UpdateFamilyTreeRequest request)
    {
        var repo = _unitOfWork.IFamilyTreeRepository;
        var tree = await repo.FindSingle(t => t.Id == id && t.IsDelete == false);

        if (tree is null)
            return NotFound<FamilyTreeResponse>($"Không tìm thấy gia phả có Id = {id}.");

        _mapper.Map(request, tree);
        repo.Update(tree);
        await _unitOfWork.SaveChangesAsync();

        var response = _mapper.Map<FamilyTreeResponse>(tree);
        return Success(response);
    }

    public async Task<Result<bool>> Delete(int id)
    {
        var repo = _unitOfWork.IFamilyTreeRepository;
        var tree = await repo.FindSingle(t => t.Id == id && t.IsDelete == false);

        if (tree is null)
            return NotFound<bool>($"Không tìm thấy gia phả có Id = {id}.");

        repo.Remove(tree);
        await _unitOfWork.SaveChangesAsync();

        var response = _mapper.Map<FamilyTreeResponse>(tree);
        return Success(true, "Xoá gia phả thành công.");
    }
}
