using GiaPhaHub_be.Domain.Abstractions.IEntities;

namespace GiaPhaHub_be.Domain.Abstractions.Base
{
    public abstract class EntityTrackable<T> : EntityBase<T>, ITrackable<T>
    {
        public bool IsDelete { get; set; }
        public DateTimeOffset CreateDate { get; set; } = DateTimeOffset.UtcNow;
        public DateTimeOffset ModifiedDate { get; set; } = DateTimeOffset.UtcNow;
    }
}