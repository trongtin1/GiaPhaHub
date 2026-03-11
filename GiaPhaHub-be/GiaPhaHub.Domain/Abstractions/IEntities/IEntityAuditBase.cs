using GiaPhaHub_be.Domain.Abstractions.Interfaces;
namespace GiaPhaHub_be.Domain.Abstractions.IEntities
{
    public interface IEntityAuditBase<T> : IEntityBase<T>, IAuditable
    {

    }
}
