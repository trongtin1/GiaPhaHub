namespace GiaPhaHub_be.Domain.Abstractions.Interfaces
{
    public interface IEntityBase<T>
    {
        T Id { get; set; }
    }
}
