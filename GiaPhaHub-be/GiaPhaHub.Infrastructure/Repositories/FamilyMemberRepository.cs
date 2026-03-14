using GiaPhaHub_be.Application.DTOs;
using GiaPhaHub_be.Domain.Entities;
using GiaPhaHub_be.Domain.IRepositories;
using GiaPhaHub_be.Infrastructure.Data;
using GiaPhaHub_be.Infrastructure.Common;
using Microsoft.EntityFrameworkCore;

namespace GiaPhaHub_be.Infrastructure.Repositories;

public class FamilyMemberRepository : GenericRepository<FamilyMember>, IFamilyMemberRepository
{
    private readonly AppDbContext _context;

    public FamilyMemberRepository(AppDbContext context) : base(context)
    {
        _context = context;
    }

    public async Task<List<MemberRelationshipDto>> GetMemberRelationships(int memberId)
    {
        FormattableString sql = $@"
            SELECT
                r.ToMemberId AS MemberId,
                m.Name AS MemberName,
                rt.Name AS Relationship
            FROM Relationships r
            INNER JOIN RelationshipTypes rt ON rt.Id = r.RelationshipTypeId
            INNER JOIN FamilyMembers m ON m.Id = r.ToMemberId
            WHERE r.FromMemberId = {memberId}
            AND r.IsDelete = 0
            AND m.IsDelete = 0

            UNION ALL

            SELECT
                r.FromMemberId AS MemberId,
                m.Name AS MemberName,
                rt.Name AS Relationship
            FROM Relationships r
            INNER JOIN RelationshipTypes rt ON rt.Id = r.RelationshipTypeId
            INNER JOIN FamilyMembers m ON m.Id = r.FromMemberId
            WHERE r.ToMemberId = {memberId}
            AND r.IsDelete = 0
            AND m.IsDelete = 0

            ORDER BY MemberName";

        return await _context.Database
            .SqlQuery<MemberRelationshipDto>(sql)
            .ToListAsync();
    }

}