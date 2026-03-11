using GiaPhaHub_be.Domain.Entities;
using GiaPhaHub_be.Domain.IRepositories;
using GiaPhaHub_be.Infrastructure.Data;
using GiaPhaHub_be.Infrastructure.Common;

namespace GiaPhaHub_be.Infrastructure.Repositories;

public class RelationshipRepository : GenericRepository<Relationship>, IRelationshipRepository
{
    public RelationshipRepository(AppDbContext context) : base(context)
    {
    }
}
