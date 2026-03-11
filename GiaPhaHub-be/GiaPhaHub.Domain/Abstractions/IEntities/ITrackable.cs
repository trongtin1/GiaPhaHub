using GiaPhaHub_be.Domain.Abstractions.Interfaces;
namespace GiaPhaHub_be.Domain.Abstractions.IEntities
{
    public interface ITrackable<T> : IEntityBase<T>, ISoftDelete, IDateTracking
    {
    }
}
