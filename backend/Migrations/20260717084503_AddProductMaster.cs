using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace NavbharatAgroAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddProductMaster : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ProductCode = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    ProductName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    DealerPrice = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    DairyFarmerPrice = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "Id", "CreatedAt", "DairyFarmerPrice", "DealerPrice", "IsActive", "ProductCode", "ProductName" },
                values: new object[,]
                {
                    { 1, new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 0m, 0m, true, "P01", "Grow Max 1Kg" },
                    { 2, new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 0m, 0m, true, "P02", "Grow Max 300gm" },
                    { 3, new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 0m, 0m, true, "P03", "Navmin 1Kg" },
                    { 4, new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 0m, 0m, true, "P04", "Navmin 5Kg" },
                    { 5, new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 0m, 0m, true, "P05", "Navmin 20Kg" },
                    { 6, new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 0m, 0m, true, "P06", "Garbhacare 1Kg" },
                    { 7, new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 0m, 0m, true, "P07", "Heat Plus 2.750Kg" },
                    { 8, new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 0m, 0m, true, "P08", "Heat Plus 400gm" },
                    { 9, new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 0m, 0m, true, "P09", "Milkmax 1Ltr" },
                    { 10, new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 0m, 0m, true, "P10", "Milkmax 5Ltr" },
                    { 11, new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 0m, 0m, true, "P11", "Fat Max 1Kg" },
                    { 12, new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 0m, 0m, true, "P12", "Fat Max 300gm" },
                    { 13, new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 0m, 0m, true, "P13", "MustGuard 250gm" },
                    { 14, new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 0m, 0m, true, "P14", "MustGuard 500gm" },
                    { 15, new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 0m, 0m, true, "P15", "Murghas" },
                    { 16, new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), 0m, 0m, true, "P16", "Sarki" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Products_ProductCode",
                table: "Products",
                column: "ProductCode",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Products");
        }
    }
}
