using GiaPhaHub_be.Domain.IRepositories;

namespace GiaPhaHub_be.Domain.Common;

public interface IUnitOfWork : IDisposable
{
    IFamilyMemberRepository IFamilyMemberRepository { get; }
    IAuthRepository IAuthRepository { get; }
    
    // New Repositories
    IFamilyTreeRepository IFamilyTreeRepository { get; }
    IRelationshipRepository IRelationshipRepository { get; }
    IRelationshipTypeRepository IRelationshipTypeRepository { get; }
    IUserRepository IUserRepository { get; }
    IUserTokenRepository IUserTokenRepository { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    Task BeginTransactionAsync(CancellationToken cancellationToken = default);
    Task CommitTransactionAsync(CancellationToken cancellationToken = default);
    Task RollbackTransactionAsync(CancellationToken cancellationToken = default);
}
