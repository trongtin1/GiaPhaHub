using GiaPhaHub_be.Domain.Abstractions.IEntities;

namespace GiaPhaHub_be.Domain.Abstractions.Base
{
    public abstract class EntityDeleteBase<T> : EntityBase<T>, IEntityDeleteBase<T>
    {
        public bool IsDelete { get; set; }
    }
}