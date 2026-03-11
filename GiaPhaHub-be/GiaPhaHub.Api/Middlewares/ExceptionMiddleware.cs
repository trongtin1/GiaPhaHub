using System.Net;
using System.Text.Json;
using GiaPhaHub_be.Application.Common;

namespace GiaPhaHub_be.Api.Middlewares;

public static class ExceptionMiddlewareExtensions
{
    public static IApplicationBuilder UseExceptionMiddleware(this IApplicationBuilder app)
        => app.UseMiddleware<ExceptionMiddleware>();
}

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;
    private readonly IHostEnvironment _env;

    public ExceptionMiddleware(
        RequestDelegate next,
        ILogger<ExceptionMiddleware> logger,
        IHostEnvironment env)
    {
        _next = next;
        _logger = logger;
        _env = env;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex,
                "Unhandled exception at {Method} {Path}",
                context.Request.Method,
                context.Request.Path);

            await HandleExceptionAsync(context, ex);
        }
    }

    private Task HandleExceptionAsync(HttpContext context, Exception ex)
    {
        var message = _env.IsDevelopment()
            ? $"{ex.GetType().Name}: {ex.Message}"
            : "An unexpected error occurred.";

        var result = Result<object>.Failure(
            HttpStatusCode.InternalServerError,
            message
        );

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

        var json = JsonSerializer.Serialize(result,
            new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

        return context.Response.WriteAsync(json);
    }

}