using AutoMapper;
using GiaPhaHub_be.Domain.Models;

namespace GiaPhaHub_be.Application.Extensions;

public static class PageListExtensions
{
    public static PageList<TDestination> MapToPageList<TSource, TDestination>(
        this PageList<TSource> source,
        IMapper mapper)
    {
        var mappedItems = mapper.Map<List<TDestination>>(source.Items);

        return new PageList<TDestination>(
        mappedItems,
        source.TotalCount,
        source.Page,
        source.PageSize
    );
    }
}