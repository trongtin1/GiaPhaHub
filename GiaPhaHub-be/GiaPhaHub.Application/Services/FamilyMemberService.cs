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

    // ── Get Tree By RootId (FamilyMemberId) ─────────────────
    public async Task<Result<FamilyMemberResponse>> GetTreeByRootId(int rootId)
    {
        var rootMember = await _unitOfWork.IFamilyMemberRepository.FindSingle(
            predicate: m => m.Id == rootId && m.IsDelete == false);

        if (rootMember is null)
            return NotFound<FamilyMemberResponse>($"Không tìm thấy thành viên có Id = {rootId}.");

        var familyTreeId = rootMember.FamilyTreeId;

        var familyTree = await _unitOfWork.IFamilyTreeRepository.FindSingle(
            predicate: t => t.Id == familyTreeId && t.IsDelete == false);

        if (familyTree is null)
            return NotFound<FamilyMemberResponse>($"Không tìm thấy gia phả có Id = {familyTreeId}.");

        var members = await _unitOfWork.IFamilyMemberRepository.FindList(
            predicate: m => m.FamilyTreeId == familyTreeId && m.IsDelete == false,
            orderBy: q => q.OrderBy(m => m.Generation).ThenBy(m => m.Id));
        if (members.Count == 0)
        {
            var response = _mapper.Map<FamilyMemberResponse>(rootMember);
            return Success(response);
        }

        var memberIds = members.Select(m => m.Id).ToHashSet();

        var relationships = await _unitOfWork.IRelationshipRepository.FindList(
            predicate: r => r.IsDelete == false
                && memberIds.Contains(r.FromMemberId)
                && memberIds.Contains(r.ToMemberId),
            include: q => q.Include(r => r.RelationshipType));

        var nodeMap = members.ToDictionary(
            m => m.Id,
            m => new FamilyMemberResponse
            {
                Id = m.Id,
                Name = m.Name,
                Gender = m.Gender,
                BirthDate = m.BirthDate,
                DeathDate = m.DeathDate,
                Avatar = m.Avatar,
                Phone = m.Phone,
                Address = m.Address,
                Bio = m.Bio,
                Generation = m.Generation
            });

        var childIdsByParent = memberIds.ToDictionary(id => id, _ => new HashSet<int>());
        var spouseIdsByMember = memberIds.ToDictionary(id => id, _ => new HashSet<int>());

        foreach (var rel in relationships)
        {
            var relationName = rel.RelationshipType?.Name?.Trim();
            if (string.IsNullOrWhiteSpace(relationName))
            {
                continue;
            }

            if (CheckRelationship(relationName, "Father") || CheckRelationship(relationName, "Mother"))
            {
                // In current seed data: FromMemberId = child, ToMemberId = parent.
                var childNode = nodeMap[rel.FromMemberId];
                var parentNode = nodeMap[rel.ToMemberId];

                if (childNode.Generation <= parentNode.Generation)
                {
                    continue;
                }

                if (childIdsByParent[rel.ToMemberId].Add(rel.FromMemberId))
                {
                    parentNode.Children.Add(childNode.Id);
                }

                if (CheckRelationship(relationName, "Father") && childNode.FatherId is null)
                {
                    childNode.FatherId = rel.ToMemberId;
                }
                else if (CheckRelationship(relationName, "Mother") && childNode.MotherId is null)
                {
                    childNode.MotherId = rel.ToMemberId;
                }
            }
            else if (CheckRelationship(relationName, "Spouse"))
            {
                spouseIdsByMember[rel.FromMemberId].Add(rel.ToMemberId);
                spouseIdsByMember[rel.ToMemberId].Add(rel.FromMemberId);
            }
        }

        foreach (var member in members)
        {
            var node = nodeMap[member.Id];
            node.Children = node.Children
                .OrderBy(id => nodeMap[id].Generation)
                .ThenBy(id => id)
                .ToList();

            node.Spouses = spouseIdsByMember[member.Id]
                .OrderBy(id => id)
                .ToList();
        }

        if (!nodeMap.ContainsKey(rootId))
            return NotFound<FamilyMemberResponse>($"Không tìm thấy thành viên có Id = {rootId} trong cây gia phả.");

        var rootNode = nodeMap[rootId];
        rootNode.Members = nodeMap
            .Where(kv => kv.Key != rootId)
            .ToDictionary(kv => kv.Key, kv => kv.Value);

        return Success(rootNode);
    }

    // ── Get By Id ────────────────────────────────────────────
    public async Task<Result<FamilyMemberResponse>> GetById(int id)
    {

        var repo = _unitOfWork.IFamilyMemberRepository;
        var member = await repo.FindSingle(
            predicate: m => m.Id == id && m.IsDelete == false);

        if (member is null)
            return NotFound<FamilyMemberResponse>($"Không tìm thấy thành viên có Id = {id}.");

        var response = _mapper.Map<FamilyMemberResponse>(member);
        response.Relationships = await repo.GetMemberRelationships(id);

        return Success(response);
    }

    // ── Create ───────────────────────────────────────────────
    public async Task<Result<FamilyMemberResponse>> Create(FamilyMemberRequest request)
    {

        var repo = _unitOfWork.IFamilyMemberRepository;
        var member = _mapper.Map<FamilyMember>(request);

        await repo.Add(member);
        await _unitOfWork.SaveChangesAsync();

        var response = _mapper.Map<FamilyMemberResponse>(member);
        return Created(response);
    }


    // ── Update ───────────────────────────────────────────────
    public async Task<Result<FamilyMemberResponse>> Update(int id, FamilyMemberRequest request)
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

    private static bool CheckRelationship(string relationName, string expectedRelation)
        => relationName.Equals(expectedRelation, StringComparison.OrdinalIgnoreCase);

}
