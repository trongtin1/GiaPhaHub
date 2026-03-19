using GiaPhaHub_be.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace GiaPhaHub_be.Infrastructure.Data;

public static class SeedData
{
    private static readonly DateTimeOffset SeedDate = new DateTimeOffset(2024, 6, 1, 0, 0, 0, TimeSpan.Zero);
    private static readonly Guid AdminUserId = Guid.Parse("53AB9B57-C1DC-4146-8B95-08DE7F8EEF11");

    public static void Seed(ModelBuilder modelBuilder)
    {
        SeedRelationshipTypes(modelBuilder);
        SeedUsers(modelBuilder);
        SeedUserTokens(modelBuilder);
        SeedFamilyTrees(modelBuilder);
        SeedFamilyMembers(modelBuilder);
        SeedRelationships(modelBuilder);
    }

    private static void SeedRelationshipTypes(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<RelationshipType>().HasData(
            new RelationshipType { Id = 1, Name = "Parent", Description = "Cha/Mẹ" },
            new RelationshipType { Id = 2, Name = "Spouse", Description = "Vợ/Chồng" }
        );
    }

    private static void SeedUsers(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>().HasData(
            new User
            {
                Id = AdminUserId,
                Email = "admin@gmail.com",
                PasswordHash = "$2a$11$hwju4D4c5R3PY0ejkd0C8OVvuxmtsYh1QxVVTHkU9FEo.Oz1pHZHG",
                FullName = "Quản trị viên",
                IsDelete = false,
                CreateDate = SeedDate,
                ModifiedDate = SeedDate
            }
        );
    }

    private static void SeedUserTokens(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UserToken>().HasData(
            new UserToken
            {
                Id = 1,
                UserId = AdminUserId.ToString(),
                Token = "seed-refresh-token-placeholder",
                TokenType = "RefreshToken",
                ExpiredAt = new DateTime(2030, 1, 1),
                IsRevoked = true,
                CreatedAt = new DateTime(2024, 6, 1, 0, 0, 0, DateTimeKind.Utc)
            }
        );
    }

    private static void SeedFamilyTrees(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<FamilyTree>().HasData(
            new FamilyTree
            {
                Id = 1,
                Name = "Gia phả họ Nguyễn",
                Description = "Gia phả mẫu dùng để minh họa",
                IsDelete = false,
                CreateDate = SeedDate,
                ModifiedDate = SeedDate
            }
        );
    }

    private static void SeedFamilyMembers(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<FamilyMember>().HasData(
            // Thế hệ 1 - Ông bà
            new FamilyMember
            {
                Id = 1,
                Name = "Nguyễn Văn An",
                Gender = "male",
                BirthDate = new DateTime(1940, 5, 10),
                DeathDate = new DateTime(2015, 3, 20),
                Bio = "Người sáng lập gia phả",
                FamilyTreeId = 1,
                Generation = 1,
                IsDelete = false,
                CreateDate = SeedDate,
                ModifiedDate = SeedDate
            },
            new FamilyMember
            {
                Id = 2,
                Name = "Trần Thị Bình",
                Gender = "female",
                BirthDate = new DateTime(1943, 8, 15),
                DeathDate = new DateTime(2020, 12, 1),
                Bio = "Vợ ông Nguyễn Văn An",
                FamilyTreeId = 1,
                Generation = 1,
                IsDelete = false,
                CreateDate = SeedDate,
                ModifiedDate = SeedDate
            },
            // Thế hệ 2 - Cha mẹ
            new FamilyMember
            {
                Id = 3,
                Name = "Nguyễn Văn Cường",
                Gender = "male",
                BirthDate = new DateTime(1965, 2, 14),
                Phone = "0901234567",
                Address = "123 Nguyễn Huệ, Quận 1, TP.HCM",
                Bio = "Con trai cả",
                FamilyTreeId = 1,
                Generation = 2,
                IsDelete = false,
                CreateDate = SeedDate,
                ModifiedDate = SeedDate
            },
            new FamilyMember
            {
                Id = 4,
                Name = "Lê Thị Dung",
                Gender = "female",
                BirthDate = new DateTime(1968, 7, 22),
                Phone = "0907654321",
                Address = "123 Nguyễn Huệ, Quận 1, TP.HCM",
                Bio = "Vợ anh Nguyễn Văn Cường",
                FamilyTreeId = 1,
                Generation = 2,
                IsDelete = false,
                CreateDate = SeedDate,
                ModifiedDate = SeedDate
            },
            new FamilyMember
            {
                Id = 5,
                Name = "Nguyễn Thị Em",
                Gender = "female",
                BirthDate = new DateTime(1970, 11, 3),
                Phone = "0912345678",
                Address = "456 Lê Lợi, Quận 3, TP.HCM",
                Bio = "Con gái thứ hai",
                FamilyTreeId = 1,
                Generation = 2,
                IsDelete = false,
                CreateDate = SeedDate,
                ModifiedDate = SeedDate
            },
            // Thế hệ 3 - Con cháu
            new FamilyMember
            {
                Id = 6,
                Name = "Nguyễn Văn Phong",
                Gender = "male",
                BirthDate = new DateTime(1990, 4, 18),
                Phone = "0923456789",
                Address = "789 Trần Hưng Đạo, Quận 5, TP.HCM",
                Bio = "Con trai anh Cường",
                FamilyTreeId = 1,
                Generation = 3,
                IsDelete = false,
                CreateDate = SeedDate,
                ModifiedDate = SeedDate
            },
            new FamilyMember
            {
                Id = 7,
                Name = "Nguyễn Thị Giang",
                Gender = "female",
                BirthDate = new DateTime(1993, 9, 25),
                Phone = "0934567890",
                Address = "123 Nguyễn Huệ, Quận 1, TP.HCM",
                Bio = "Con gái anh Cường",
                FamilyTreeId = 1,
                Generation = 3,
                IsDelete = false,
                CreateDate = SeedDate,
                ModifiedDate = SeedDate
            }
        );
    }

    private static void SeedRelationships(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Relationship>().HasData(
            // Ông An là parent của Cường
            new Relationship
            {
                Id = 1,
                FromMemberId = 3,
                ToMemberId = 1,
                RelationshipTypeId = 1, // Parent
                IsDelete = false,
                CreateDate = SeedDate,
                ModifiedDate = SeedDate
            },
            // Bà Bình là parent của Cường
            new Relationship
            {
                Id = 2,
                FromMemberId = 3,
                ToMemberId = 2,
                RelationshipTypeId = 1, // Parent
                IsDelete = false,
                CreateDate = SeedDate,
                ModifiedDate = SeedDate
            },
            // Ông An là parent của Em
            new Relationship
            {
                Id = 3,
                FromMemberId = 5,
                ToMemberId = 1,
                RelationshipTypeId = 1, // Parent
                IsDelete = false,
                CreateDate = SeedDate,
                ModifiedDate = SeedDate
            },
            // Bà Bình là parent của Em
            new Relationship
            {
                Id = 4,
                FromMemberId = 5,
                ToMemberId = 2,
                RelationshipTypeId = 1, // Parent
                IsDelete = false,
                CreateDate = SeedDate,
                ModifiedDate = SeedDate
            },
            // Ông An và Bà Bình là vợ chồng
            new Relationship
            {
                Id = 5,
                FromMemberId = 1,
                ToMemberId = 2,
                RelationshipTypeId = 2, // Spouse
                IsDelete = false,
                CreateDate = SeedDate,
                ModifiedDate = SeedDate
            },
            // Cường và Dung là vợ chồng
            new Relationship
            {
                Id = 6,
                FromMemberId = 3,
                ToMemberId = 4,
                RelationshipTypeId = 2, // Spouse
                IsDelete = false,
                CreateDate = SeedDate,
                ModifiedDate = SeedDate
            },
            // Cường là parent của Phong
            new Relationship
            {
                Id = 7,
                FromMemberId = 6,
                ToMemberId = 3,
                RelationshipTypeId = 1, // Parent
                IsDelete = false,
                CreateDate = SeedDate,
                ModifiedDate = SeedDate
            },
            // Dung là parent của Phong
            new Relationship
            {
                Id = 8,
                FromMemberId = 6,
                ToMemberId = 4,
                RelationshipTypeId = 1, // Parent
                IsDelete = false,
                CreateDate = SeedDate,
                ModifiedDate = SeedDate
            },
            // Cường là parent của Giang
            new Relationship
            {
                Id = 9,
                FromMemberId = 7,
                ToMemberId = 3,
                RelationshipTypeId = 1, // Parent
                IsDelete = false,
                CreateDate = SeedDate,
                ModifiedDate = SeedDate
            },
            // Dung là parent của Giang
            new Relationship
            {
                Id = 10,
                FromMemberId = 7,
                ToMemberId = 4,
                RelationshipTypeId = 1, // Parent
                IsDelete = false,
                CreateDate = SeedDate,
                ModifiedDate = SeedDate
            }
        );
    }
}