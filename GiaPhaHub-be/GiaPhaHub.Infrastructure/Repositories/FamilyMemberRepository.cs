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
                        r.FromMemberId,
                        fm.Name AS FromMemberName,
                        r.ToMemberId,
                        tm.Name AS ToMemberName,
                        rt.Name AS Relationship
                    FROM Relationships r
                    INNER JOIN RelationshipTypes rt ON rt.Id = r.RelationshipTypeId
                    INNER JOIN FamilyMembers fm ON fm.Id = r.FromMemberId
                    INNER JOIN FamilyMembers tm ON tm.Id = r.ToMemberId
                    WHERE (r.FromMemberId = {memberId} OR r.ToMemberId = {memberId})
                    AND r.IsDelete = 0
                    AND fm.IsDelete = 0
                    AND tm.IsDelete = 0
                    ORDER BY ToMemberName";

        return await _context.Database
            .SqlQuery<MemberRelationshipDto>(sql)
            .ToListAsync();
    }

}