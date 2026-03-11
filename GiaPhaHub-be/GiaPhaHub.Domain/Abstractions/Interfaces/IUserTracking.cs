namespace GiaPhaHub_be.Domain.Abstractions.Interfaces
{
    public interface IUserTracking
    {
        string? CreatedBy { get; set; }
        string? ModifiedBy { get; set; }
    }
}
