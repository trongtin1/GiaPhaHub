
using GiaPhaHub_be.Domain.Common;
using GiaPhaHub_be.Domain.IRepositories;
using GiaPhaHub_be.Infrastructure.Data;
using GiaPhaHub_be.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

namespace GiaPhaHub_be.Infrastructure.Common;

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _context;
    private IDbContextTransaction? _currentTransaction;
    private bool _disposed;
    private readonly ILogger<UnitOfWork> _logger;

    public UnitOfWork(AppDbContext context, ILogger<UnitOfWork> logger)
    {
        _context = context;
        _logger = logger;
    }

    public IFamilyMemberRepository IFamilyMemberRepository => new FamilyMemberRepository(_context);
    public IAuthRepository IAuthRepository => new AuthRepository(_context);

    public IFamilyTreeRepository IFamilyTreeRepository => new FamilyTreeRepository(_context);
    public IRelationshipRepository IRelationshipRepository => new RelationshipRepository(_context);
    public IRelationshipTypeRepository IRelationshipTypeRepository => new RelationshipTypeRepository(_context);
    public IUserRepository IUserRepository => new UserRepository(_context);
    public IUserTokenRepository IUserTokenRepository => new UserTokenRepository(_context);

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task BeginTransactionAsync(CancellationToken cancellationToken = default)
    {
        _currentTransaction ??= await _context.Database.BeginTransactionAsync(cancellationToken);
    }

    public async Task CommitTransactionAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            await _context.SaveChangesAsync(cancellationToken);

            if (_currentTransaction is not null)
            {
                await _currentTransaction.CommitAsync(cancellationToken);
            }
        }
        catch
        {
            await RollbackTransactionAsync(cancellationToken);
            throw;
        }
        finally
        {
            if (_currentTransaction is not null)
            {
                await _currentTransaction.DisposeAsync();
                _currentTransaction = null;
            }
        }
    }

    public async Task RollbackTransactionAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            if (_currentTransaction is not null)
            {
                await _currentTransaction.RollbackAsync(cancellationToken);
            }
        }
        finally
        {
            if (_currentTransaction is not null)
            {
                await _currentTransaction.DisposeAsync();
                _currentTransaction = null;
            }
        }
    }

    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }

    protected virtual void Dispose(bool disposing)
    {
        if (!_disposed)
        {
            if (disposing)
            {
                _context.Dispose();
            }

            _disposed = true;
        }
    }
    public async Task ExecuteSqlRawAsync(string sql)
    {
        try
        {
            await _context.Database.ExecuteSqlRawAsync(sql);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error executing SQL raw: {Sql}", sql);
            throw;
        }
    }
}
