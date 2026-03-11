using Microsoft.EntityFrameworkCore;
using GiaPhaHub_be.Domain.Entities;

namespace GiaPhaHub_be.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<FamilyMember> FamilyMembers { get; set; }
    public DbSet<FamilyTree> FamilyTrees { get; set; }
    public DbSet<Relationship> Relationships { get; set; }
    public DbSet<RelationshipType> RelationshipTypes { get; set; }
    public DbSet<UserToken> UserTokens { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ── User ─────────────────────────────
        modelBuilder.Entity<User>(entity =>
        {
            entity.Property(x => x.Email)
                .HasColumnType("varchar(255)")
                .IsRequired();

            entity.Property(x => x.PasswordHash)
                .HasColumnType("varchar(500)")
                .IsRequired();

            entity.Property(x => x.FullName)
                .HasColumnType("nvarchar(255)");
        });

        // ── UserToken ─────────────────────────
        modelBuilder.Entity<UserToken>(entity =>
        {
            entity.HasKey(x => x.Id);

            entity.Property(x => x.Token)
                .HasColumnType("varchar(500)")
                .IsRequired();

            entity.Property(x => x.TokenType)
                .HasColumnType("varchar(50)")
                .IsRequired();

            entity.Property(x => x.ExpiredAt)
                .HasColumnType("datetime");

            entity.Property(x => x.IsRevoked)
                .HasColumnType("bit");

        });

        // ── FamilyTree ─────────────────────────
        modelBuilder.Entity<FamilyTree>(entity =>
        {
            entity.Property(x => x.Name)
                .HasColumnType("nvarchar(255)")
                .IsRequired();

            entity.Property(x => x.Description)
                .HasColumnType("nvarchar(1000)");
        });

        // ── FamilyMember ───────────────────────
        modelBuilder.Entity<FamilyMember>(entity =>
        {
            entity.Property(x => x.Name)
                .HasColumnType("nvarchar(255)")
                .IsRequired();

            entity.Property(x => x.Gender)
                .HasColumnType("varchar(10)");

            entity.Property(x => x.BirthDate)
                .HasColumnType("datetime");

            entity.Property(x => x.DeathDate)
                .HasColumnType("datetime");

            entity.Property(x => x.Avatar)
                .HasColumnType("varchar(500)");

            entity.Property(x => x.Phone)
                .HasColumnType("varchar(20)");

            entity.Property(x => x.Address)
                .HasColumnType("nvarchar(500)");

            entity.Property(x => x.Bio)
                .HasColumnType("nvarchar(max)");

            entity.HasOne(x => x.FamilyTree)
                .WithMany(x => x.Members)
                .HasForeignKey(x => x.FamilyTreeId);
        });

        // ── Relationship ───────────────────────
        modelBuilder.Entity<Relationship>(entity =>
        {
            entity.Property(x => x.FromMemberId)
                .HasColumnType("int");

            entity.Property(x => x.ToMemberId)
                .HasColumnType("int");

            entity.Property(x => x.RelationshipTypeId)
                .HasColumnType("int");

            entity.HasOne(r => r.FromMember)
                .WithMany(m => m.FromRelationships)
                .HasForeignKey(r => r.FromMemberId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(r => r.ToMember)
                .WithMany(m => m.ToRelationships)
                .HasForeignKey(r => r.ToMemberId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(r => r.RelationshipType)
                .WithMany(t => t.Relationships)
                .HasForeignKey(r => r.RelationshipTypeId);
        });

        // ── RelationshipType ───────────────────
        modelBuilder.Entity<RelationshipType>(entity =>
        {
            entity.Property(x => x.Name)
                .HasColumnType("varchar(50)")
                .IsRequired();

            entity.Property(x => x.Description)
                .HasColumnType("nvarchar(255)");
        });
    }
}