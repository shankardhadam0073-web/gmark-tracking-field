using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NavbharatAgroAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddFieldVisitProductNames : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ProductNames",
                table: "FieldVisits",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProductNames",
                table: "FieldVisits");
        }
    }
}
