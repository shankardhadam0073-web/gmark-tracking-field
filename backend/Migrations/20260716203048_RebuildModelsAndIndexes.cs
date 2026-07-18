using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NavbharatAgroAPI.Migrations
{
    /// <inheritdoc />
    public partial class RebuildModelsAndIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Clean up invalid data before applying constraint
            migrationBuilder.Sql("DELETE FROM \"OrderProducts\" WHERE \"Quantity\" <= 0;");
            migrationBuilder.Sql("DELETE FROM \"OrderProducts\" WHERE \"UnitPrice\" < 0;");

            migrationBuilder.AddCheckConstraint(
                name: "CK_OrderProduct_Quantity",
                table: "OrderProducts",
                sql: "\"Quantity\" > 0");

            migrationBuilder.AddCheckConstraint(
                name: "CK_OrderProduct_UnitPrice",
                table: "OrderProducts",
                sql: "\"UnitPrice\" >= 0");

            migrationBuilder.CreateIndex(
                name: "IX_OrderBookings_BookingDate",
                table: "OrderBookings",
                column: "BookingDate");

            migrationBuilder.CreateIndex(
                name: "IX_FieldVisits_VisitDate",
                table: "FieldVisits",
                column: "VisitDate");

            migrationBuilder.CreateIndex(
                name: "IX_Employees_EmployeeCode",
                table: "Employees",
                column: "EmployeeCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Employees_MobileNumber",
                table: "Employees",
                column: "MobileNumber");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CK_OrderProduct_Quantity",
                table: "OrderProducts");

            migrationBuilder.DropCheckConstraint(
                name: "CK_OrderProduct_UnitPrice",
                table: "OrderProducts");

            migrationBuilder.DropIndex(
                name: "IX_OrderBookings_BookingDate",
                table: "OrderBookings");

            migrationBuilder.DropIndex(
                name: "IX_FieldVisits_VisitDate",
                table: "FieldVisits");

            migrationBuilder.DropIndex(
                name: "IX_Employees_EmployeeCode",
                table: "Employees");

            migrationBuilder.DropIndex(
                name: "IX_Employees_MobileNumber",
                table: "Employees");
        }
    }
}
