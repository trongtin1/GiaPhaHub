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

public class FamilyMemberService : BaseService, IFamilyMemberService
{
    public FamilyMemberService(IUnitOfWork unitOfWork, IMapper mapper)
        : base(unitOfWork, mapper)
    {
    }

    // ── Get All ──────────────────────────────────────────────
    public async Task<Result<PageList<FamilyMemberResponse>>> GetAll(QueryResource queryResource)
    {

        var pagingSpec = new PagingSpecification(queryResource);
        var columnsMap = new Dictionary<string, Expression<Func<FamilyMember, object>>>
        {
            ["name"] = x => x.Name,
            ["gender"] = x => x.BirthDate
        };
        var members = await _unitOfWork.IFamilyMemberRepository.FindAll(
            predicate: m => m.IsDelete == false,
            orderBy: q => String.IsNullOrEmpty(queryResource.SortColumnBy)
                ? q.OrderBy(e => e.Id)
                : queryResource.IsSortColumnAscending ?
                q.OrderBy(columnsMap[queryResource.SortColumnBy])
                : q.OrderByDescending(columnsMap[queryResource.SortColumnBy]),
            pagingSpecification: pagingSpec
        );

        var result = members.MapToPageList<FamilyMember, FamilyMemberResponse>(_mapper);

        return Success(result);
    }


    // ── Get By Id ────────────────────────────────────────────
    public async Task<Result<FamilyMemberResponse>> GetById(int id)
    {

        var repo = _unitOfWork.IFamilyMemberRepository;
        var member = await repo.FindSingle(m => m.Id == id);

        if (member is null)
            return NotFound<FamilyMemberResponse>($"Không tìm thấy thành viên có Id = {id}.");

        var response = _mapper.Map<FamilyMemberResponse>(member);
        return Success(response);
    }



    // ── Create ───────────────────────────────────────────────
    public async Task<Result<FamilyMemberResponse>> Create(CreateFamilyMemberRequest request)
    {

        var repo = _unitOfWork.IFamilyMemberRepository;
        var member = _mapper.Map<FamilyMember>(request);

        await repo.Add(member);
        await _unitOfWork.SaveChangesAsync();

        var response = _mapper.Map<FamilyMemberResponse>(member);
        return Created(response);
    }


    // ── Update ───────────────────────────────────────────────
    public async Task<Result<FamilyMemberResponse>> Update(int id, UpdateFamilyMemberRequest request)
    {
        var repo = _unitOfWork.IFamilyMemberRepository;
        var member = await repo.FindSingle(m => m.Id == id);

        if (member is null)
            return NotFound<FamilyMemberResponse>($"Không tìm thấy thành viên có Id = {id}.");
        _mapper.Map(request, member);

        repo.Update(member);
        await _unitOfWork.SaveChangesAsync();

        var response = _mapper.Map<FamilyMemberResponse>(member);
        return Success(response);
    }


    // ── Delete ───────────────────────────────────────────────
    public async Task<Result<bool>> Delete(int id)
    {

        var repo = _unitOfWork.IFamilyMemberRepository;
        var member = await repo.FindSingle(m => m.Id == id);

        if (member is null)
            return NotFound<bool>($"Không tìm thấy thành viên có Id = {id}.");

        repo.Remove(member);
        await _unitOfWork.SaveChangesAsync();

        return Success(true, "Xoá thành viên thành công.");
    }

}
