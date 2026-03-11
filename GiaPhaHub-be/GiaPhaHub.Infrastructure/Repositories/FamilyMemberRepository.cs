using GiaPhaHub_be.Domain.Entities;
using GiaPhaHub_be.Domain.IRepositories;
using GiaPhaHub_be.Infrastructure.Data;
using GiaPhaHub_be.Infrastructure.Common;

namespace GiaPhaHub_be.Infrastructure.Repositories;

public class FamilyMemberRepository : GenericRepository<FamilyMember>, IFamilyMemberRepository
{
    public FamilyMemberRepository(AppDbContext context) : base(context)
    {
    }
}