using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NavbharatAgroAPI.Migrations
{
    /// <inheritdoc />
    public partial class UpdateFieldVisitProduct : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProductDiscussed",
                table: "FieldVisits");

            migrationBuilder.AddColumn<int>(
                name: "ProductId",
                table: "FieldVisits",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_FieldVisits_ProductId",
                table: "FieldVisits",
                column: "ProductId");

            migrationBuilder.AddForeignKey(
                name: "FK_FieldVisits_Products_ProductId",
                table: "FieldVisits",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FieldVisits_Products_ProductId",
                table: "FieldVisits");

            migrationBuilder.DropIndex(
                name: "IX_FieldVisits_ProductId",
                table: "FieldVisits");

            migrationBuilder.DropColumn(
                name: "ProductId",
                table: "FieldVisits");

            migrationBuilder.AddColumn<string>(
                name: "ProductDiscussed",
                table: "FieldVisits",
                type: "character varying(200)",
                maxLength: 200,
                nullable: true);
        }
    }
}
