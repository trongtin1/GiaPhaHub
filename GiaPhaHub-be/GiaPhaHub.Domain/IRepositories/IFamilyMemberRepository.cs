using GiaPhaHub_be.Domain.Common;
using GiaPhaHub_be.Domain.Entities;
using GiaPhaHub_be.Application.DTOs;

namespace GiaPhaHub_be.Domain.IRepositories
{
    public interface IFamilyMemberRepository : IGenericRepository<FamilyMember>
    {
        Task<List<MemberRelationshipDto>> GetMemberRelationships(int memberId);

    }
}