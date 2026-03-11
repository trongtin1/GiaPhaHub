using GiaPhaHub_be.Domain.Abstractions.Interfaces;
namespace GiaPhaHub_be.Domain.Abstractions.IEntities
{
    public interface IAuditable : IDateTracking, ISoftDelete, IUserTracking
    {

    }
}
