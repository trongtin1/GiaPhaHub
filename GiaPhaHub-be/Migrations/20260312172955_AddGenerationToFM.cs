using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GiaPhaHub_be.Migrations
{
    /// <inheritdoc />
    public partial class AddGenerationToFM : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Generation",
                table: "FamilyMembers",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "FamilyMembers",
                keyColumn: "Id",
                keyValue: 1,
                column: "Generation",
                value: 1);

            migrationBuilder.UpdateData(
                table: "FamilyMembers",
                keyColumn: "Id",
                keyValue: 2,
                column: "Generation",
                value: 1);

            migrationBuilder.UpdateData(
                table: "FamilyMembers",
                keyColumn: "Id",
                keyValue: 3,
                column: "Generation",
                value: 2);

            migrationBuilder.UpdateData(
                table: "FamilyMembers",
                keyColumn: "Id",
                keyValue: 4,
                column: "Generation",
                value: 2);

            migrationBuilder.UpdateData(
                table: "FamilyMembers",
                keyColumn: "Id",
                keyValue: 5,
                column: "Generation",
                value: 2);

            migrationBuilder.UpdateData(
                table: "FamilyMembers",
                keyColumn: "Id",
                keyValue: 6,
                column: "Generation",
                value: 3);

            migrationBuilder.UpdateData(
                table: "FamilyMembers",
                keyColumn: "Id",
                keyValue: 7,
                column: "Generation",
                value: 3);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Generation",
                table: "FamilyMembers");
        }
    }
}
