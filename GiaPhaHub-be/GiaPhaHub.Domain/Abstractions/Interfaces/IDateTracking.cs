namespace GiaPhaHub_be.Domain.Abstractions.Interfaces
{
    public interface IDateTracking
    {
        DateTimeOffset CreateDate { get; set; }
        DateTimeOffset ModifiedDate { get; set; }
    }
}
