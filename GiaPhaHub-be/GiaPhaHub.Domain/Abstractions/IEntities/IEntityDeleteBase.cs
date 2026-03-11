using GiaPhaHub_be.Domain.Abstractions.Interfaces;
namespace GiaPhaHub_be.Domain.Abstractions.IEntities
{
    public interface IEntityDeleteBase<T> : IEntityBase<T>, ISoftDelete
    {
    }
}
