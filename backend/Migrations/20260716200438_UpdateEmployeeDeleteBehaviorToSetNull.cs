using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NavbharatAgroAPI.Migrations
{
    /// <inheritdoc />
    public partial class UpdateEmployeeDeleteBehaviorToSetNull : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FieldVisits_Employees_EmployeeId",
                table: "FieldVisits");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderBookings_Employees_EmployeeId",
                table: "OrderBookings");

            migrationBuilder.AddForeignKey(
                name: "FK_FieldVisits_Employees_EmployeeId",
                table: "FieldVisits",
                column: "EmployeeId",
                principalTable: "Employees",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderBookings_Employees_EmployeeId",
                table: "OrderBookings",
                column: "EmployeeId",
                principalTable: "Employees",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FieldVisits_Employees_EmployeeId",
                table: "FieldVisits");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderBookings_Employees_EmployeeId",
                table: "OrderBookings");

            migrationBuilder.AddForeignKey(
                name: "FK_FieldVisits_Employees_EmployeeId",
                table: "FieldVisits",
                column: "EmployeeId",
                principalTable: "Employees",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderBookings_Employees_EmployeeId",
                table: "OrderBookings",
                column: "EmployeeId",
                principalTable: "Employees",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
