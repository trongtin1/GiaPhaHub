using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GiaPhaHub_be.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "FamilyTrees",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(255)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(1000)", nullable: true),
                    IsDelete = table.Column<bool>(type: "bit", nullable: false),
                    CreateDate = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    ModifiedDate = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FamilyTrees", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "RelationshipTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "varchar(50)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(255)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RelationshipTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(255)", nullable: false),
                    Email = table.Column<string>(type: "varchar(255)", nullable: false),
                    PasswordHash = table.Column<string>(type: "varchar(500)", nullable: false),
                    IsDelete = table.Column<bool>(type: "bit", nullable: false),
                    CreateDate = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    ModifiedDate = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UserTokens",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Token = table.Column<string>(type: "varchar(500)", nullable: false),
                    TokenType = table.Column<string>(type: "varchar(50)", nullable: false),
                    ExpiredAt = table.Column<DateTime>(type: "datetime", nullable: false),
                    IsRevoked = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserTokens", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "FamilyMembers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(255)", nullable: false),
                    Gender = table.Column<string>(type: "varchar(10)", nullable: false),
                    BirthDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    DeathDate = table.Column<DateTime>(type: "datetime", nullable: true),
                    Avatar = table.Column<string>(type: "varchar(500)", nullable: true),
                    Phone = table.Column<string>(type: "varchar(20)", nullable: true),
                    Address = table.Column<string>(type: "nvarchar(500)", nullable: true),
                    Bio = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FamilyTreeId = table.Column<int>(type: "int", nullable: false),
                    IsDelete = table.Column<bool>(type: "bit", nullable: false),
                    CreateDate = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    ModifiedDate = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FamilyMembers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FamilyMembers_FamilyTrees_FamilyTreeId",
                        column: x => x.FamilyTreeId,
                        principalTable: "FamilyTrees",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Relationships",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FromMemberId = table.Column<int>(type: "int", nullable: false),
                    ToMemberId = table.Column<int>(type: "int", nullable: false),
                    RelationshipTypeId = table.Column<int>(type: "int", nullable: false),
                    IsDelete = table.Column<bool>(type: "bit", nullable: false),
                    CreateDate = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    ModifiedDate = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Relationships", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Relationships_FamilyMembers_FromMemberId",
                        column: x => x.FromMemberId,
                        principalTable: "FamilyMembers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Relationships_FamilyMembers_ToMemberId",
                        column: x => x.ToMemberId,
                        principalTable: "FamilyMembers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Relationships_RelationshipTypes_RelationshipTypeId",
                        column: x => x.RelationshipTypeId,
                        principalTable: "RelationshipTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FamilyMembers_FamilyTreeId",
                table: "FamilyMembers",
                column: "FamilyTreeId");

            migrationBuilder.CreateIndex(
                name: "IX_Relationships_FromMemberId",
                table: "Relationships",
                column: "FromMemberId");

            migrationBuilder.CreateIndex(
                name: "IX_Relationships_RelationshipTypeId",
                table: "Relationships",
                column: "RelationshipTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Relationships_ToMemberId",
                table: "Relationships",
                column: "ToMemberId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Relationships");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "UserTokens");

            migrationBuilder.DropTable(
                name: "FamilyMembers");

            migrationBuilder.DropTable(
                name: "RelationshipTypes");

            migrationBuilder.DropTable(
                name: "FamilyTrees");
        }
    }
}
