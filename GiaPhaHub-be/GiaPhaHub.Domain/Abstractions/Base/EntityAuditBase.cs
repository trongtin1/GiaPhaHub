using GiaPhaHub_be.Domain.Abstractions.IEntities;

namespace GiaPhaHub_be.Domain.Abstractions.Base
{
    public abstract class EntityAuditBase<T> : EntityBase<T>, IEntityAuditBase<T>
    {
        public bool IsDelete { get; set; }
        public DateTimeOffset CreateDate { get; set; }
        public DateTimeOffset ModifiedDate { get; set; }
        public string? CreatedBy { get; set; }
        public string? ModifiedBy { get; set; }
    }
}