using GiaPhaHub_be.Domain.Entities;
using GiaPhaHub_be.Domain.IRepositories;
using GiaPhaHub_be.Infrastructure.Common;
using GiaPhaHub_be.Infrastructure.Data;

namespace GiaPhaHub_be.Infrastructure.Repositories;

public class AuthRepository : GenericRepository<User>, IAuthRepository
{
    public AuthRepository(AppDbContext context) : base(context)
    {
    }
}