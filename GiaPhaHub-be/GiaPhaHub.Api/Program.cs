using System.Net;
using System.Text;
using System.Text.Json;
using GiaPhaHub_be.Api.Middlewares;
using System.Threading.RateLimiting;
using GiaPhaHub.Infrastructure.Extensions;
using GiaPhaHub_be.Application.Common;
using GiaPhaHub_be.Application.IServices;
using GiaPhaHub_be.Application.Services;
using GiaPhaHub_be.Domain.Common;
using GiaPhaHub_be.Domain.Models;
using GiaPhaHub_be.Infrastructure.Common;
using GiaPhaHub_be.Infrastructure.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

namespace GiaPhaHub_be
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Đảm bảo cấu hình lấy được appsettings.json nếu chạy từ root thư mục ngoài
            builder.Configuration
                .AddJsonFile("GiaPhaHub.Api/appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"GiaPhaHub.Api/appsettings.{builder.Environment.EnvironmentName}.json", optional: true, reloadOnChange: true);

            // ── CORS ──────────────────────────────────────────────────────
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend", policy =>
                {
                    policy.WithOrigins("http://localhost:5173") // URL frontend Vite
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials(); // BẮT BUỘC để gửi/nhận cookie
                });
            });

            // ── Swagger với JWT Authorize button ──────────────────────────
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo { Title = "GiaPhaHub API", Version = "v1" });

                // Thêm nút Authorize trên Swagger UI
                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "Nhập access token. Ví dụ: eyJhbGci..."
                });

                options.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        Array.Empty<string>()
                    }
                });
            });

            // ── DbContext ─────────────────────────────────────────────────
            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            // ── JWT Authentication ────────────────────────────────────────
            var jwtSettings = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>()!;
            builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));

            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = jwtSettings.Issuer,
                        ValidAudience = jwtSettings.Audience,
                        IssuerSigningKey = new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes(jwtSettings.Key))
                    };
                });

            builder.Services.AddAuthorization();

            // ── Rate Limiting ─────────────────────────────────────────────
            builder.Services.AddRateLimiter(options =>
            {
                options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(httpContext =>
                {
                    var key = httpContext.User.Identity?.IsAuthenticated == true
                        ? httpContext.User.Identity!.Name!
                        : httpContext.Connection.RemoteIpAddress?.ToString() ?? "anonymous";

                    return RateLimitPartition.GetFixedWindowLimiter(
                        partitionKey: key,
                        factory: _ => new FixedWindowRateLimiterOptions
                        {
                            PermitLimit = 100, // 100 request
                            Window = TimeSpan.FromMinutes(1), // mỗi 1 phút
                            QueueLimit = 0,
                            AutoReplenishment = true
                        });
                });

                options.OnRejected = async (context, token) =>
                {
                    var httpContext = context.HttpContext;

                    if (context.Lease.TryGetMetadata(MetadataName.RetryAfter, out var retryAfter))
                    {
                        httpContext.Response.Headers.RetryAfter =
                            retryAfter.TotalSeconds.ToString();
                    }

                    httpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
                    httpContext.Response.ContentType = "application/json";

                    var result = Result<object>.Failure(
                        HttpStatusCode.TooManyRequests,
                        "Too many requests. Please try again later."
                     );

                    var json = JsonSerializer.Serialize(result,
                        new JsonSerializerOptions
                        {
                            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                        });

                    await httpContext.Response.WriteAsync(json, token);
                };
            });

            // ── DI ────────────────────────────────────────────────────────
            builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
            builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
            builder.Services.AddScoped<IAuthService, AuthService>();
            builder.Services.AddScoped<IFamilyMemberService, FamilyMemberService>();
            builder.Services.AddScoped<IFamilyTreeService, FamilyTreeService>();
            builder.Services.AddScoped<IRelationshipService, RelationshipService>();
            builder.Services.AddScoped<IRelationshipTypeService, RelationshipTypeService>();
            builder.Services.AddScoped<IUserService, UserService>();
            builder.Services.AddControllers();

            // ─────────────────────────────────────────────────────────────
            var app = builder.Build();

            // ── Chạy SQL scripts (stored procedures, ...) ────────────────
            await app.RunSqlScriptsAsync();

            // ── Middleware pipeline ───────────────────────────────────────
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseExceptionMiddleware();

            app.UseHttpsRedirection();

            app.UseCors("AllowFrontend");        // phải trước Authentication

            app.UseRateLimiter();                // Rate limiting

            app.UseAuthentication();             // JWT
            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
