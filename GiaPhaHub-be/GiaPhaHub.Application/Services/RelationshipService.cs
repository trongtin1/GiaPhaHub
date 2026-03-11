using System.Linq.Expressions;
using AutoMapper;
using GiaPhaHub_be.Application.Common;
using GiaPhaHub_be.Application.DTOs;
using GiaPhaHub_be.Application.Extensions;
using GiaPhaHub_be.Application.IServices;
using GiaPhaHub_be.Domain.Common;
using GiaPhaHub_be.Domain.Entities;
using GiaPhaHub_be.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace GiaPhaHub_be.Application.Services;

public class RelationshipService : BaseService, IRelationshipService
{
    public RelationshipService(IUnitOfWork unitOfWork, IMapper mapper)
        : base(unitOfWork, mapper)
    {
    }

    public async Task<Result<PageList<RelationshipResponse>>> GetAll(QueryResource queryResource)
    {
        var pagingSpec = new PagingSpecification(queryResource);

        var items = await _unitOfWork.IRelationshipRepository.FindAll(
            predicate: r => r.IsDelete == false,
            include: q => q.Include(r => r.FromMember)
                           .Include(r => r.ToMember)
                           .Include(r => r.RelationshipType),
            orderBy: q => q.OrderBy(e => e.Id),
            pagingSpecification: pagingSpec
        );

        var result = items.MapToPageList<Relationship, RelationshipResponse>(_mapper);
        return Success(result);
    }

    public async Task<Result<RelationshipResponse>> GetById(int id)
    {
        var repo = _unitOfWork.IRelationshipRepository;
        var rel = await repo.FindSingle(
            r => r.Id == id && r.IsDelete == false,
            include: q => q.Include(r => r.FromMember)
                           .Include(r => r.ToMember)
                           .Include(r => r.RelationshipType)
        );

        if (rel is null)
            return NotFound<RelationshipResponse>($"Không tìm thấy quan hệ có Id = {id}.");
        var response = _mapper.Map<RelationshipResponse>(rel);
        return Success(response);
    }

    public async Task<Result<List<RelationshipResponse>>> GetByMemberId(int memberId)
    {
        var repo = _unitOfWork.IRelationshipRepository;
        var rels = await repo.FindList(
            r => (r.FromMemberId == memberId || r.ToMemberId == memberId) && r.IsDelete == false,
            include: q => q.Include(r => r.FromMember)
                           .Include(r => r.ToMember)
                           .Include(r => r.RelationshipType)
        );
        var res = _mapper.Map<List<RelationshipResponse>>(rels);
        return Success(res);

    }

    public async Task<Result<RelationshipResponse>> Create(CreateRelationshipRequest request)
    {
        var repo = _unitOfWork.IRelationshipRepository;
        var rel = _mapper.Map<Relationship>(request);

        await repo.Add(rel);
        await _unitOfWork.SaveChangesAsync();

        // Reload with includes
        var created = await repo.FindSingle(
            r => r.Id == rel.Id,
            include: q => q.Include(r => r.FromMember)
                           .Include(r => r.ToMember)
                           .Include(r => r.RelationshipType)
        );
        var response = _mapper.Map<RelationshipResponse>(created);
        return Created(response);
    }

    public async Task<Result<RelationshipResponse>> Update(int id, UpdateRelationshipRequest request)
    {
        var repo = _unitOfWork.IRelationshipRepository;
        var rel = await repo.FindSingle(r => r.Id == id && r.IsDelete == false);

        if (rel is null)
            return NotFound<RelationshipResponse>($"Không tìm thấy quan hệ có Id = {id}.");

        _mapper.Map(request, rel);
        repo.Update(rel);
        await _unitOfWork.SaveChangesAsync();

        var updated = await repo.FindSingle(
            r => r.Id == id,
            include: q => q.Include(r => r.FromMember)
                           .Include(r => r.ToMember)
                           .Include(r => r.RelationshipType)
        );

        var response = _mapper.Map<RelationshipResponse>(updated);
        return Success(response);
    }

    public async Task<Result<bool>> Delete(int id)
    {
        var repo = _unitOfWork.IRelationshipRepository;
        var rel = await repo.FindSingle(r => r.Id == id && r.IsDelete == false);

        if (rel is null)
            return NotFound<bool>($"Không tìm thấy quan hệ có Id = {id}.");

        repo.Remove(rel);
        await _unitOfWork.SaveChangesAsync();

        return Success(true, "Xoá quan hệ thành công.");
    }
}
