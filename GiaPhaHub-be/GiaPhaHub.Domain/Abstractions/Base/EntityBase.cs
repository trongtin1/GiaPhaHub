
using Newtonsoft.Json;
using GiaPhaHub_be.Domain.Abstractions.Interfaces;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
namespace GiaPhaHub_be.Domain.Abstractions.Base
{
    public abstract class EntityBase<T> : IEntityBase<T>
    {
        [Key]
        [JsonPropertyOrder(-999)]
        public T Id { get; set; } = default!;
    }
}
