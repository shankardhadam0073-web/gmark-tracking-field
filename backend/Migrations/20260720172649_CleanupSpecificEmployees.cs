using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NavbharatAgroAPI.Migrations
{
    /// <inheritdoc />
    public partial class CleanupSpecificEmployees : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DELETE FROM \"OrderProducts\" WHERE \"OrderBookingId\" IN (SELECT \"Id\" FROM \"OrderBookings\" WHERE \"EmployeeId\" IN (SELECT \"Id\" FROM \"Employees\" WHERE \"Name\" ILIKE '%kunal%' OR \"Name\" ILIKE '%prutivraj%' OR \"Name\" ILIKE '%rohit%'))");
            migrationBuilder.Sql("DELETE FROM \"OrderBookings\" WHERE \"EmployeeId\" IN (SELECT \"Id\" FROM \"Employees\" WHERE \"Name\" ILIKE '%kunal%' OR \"Name\" ILIKE '%prutivraj%' OR \"Name\" ILIKE '%rohit%')");
            migrationBuilder.Sql("DELETE FROM \"FieldVisits\" WHERE \"EmployeeId\" IN (SELECT \"Id\" FROM \"Employees\" WHERE \"Name\" ILIKE '%kunal%' OR \"Name\" ILIKE '%prutivraj%' OR \"Name\" ILIKE '%rohit%')");
            migrationBuilder.Sql("DELETE FROM \"Employees\" WHERE \"Name\" ILIKE '%kunal%' OR \"Name\" ILIKE '%prutivraj%' OR \"Name\" ILIKE '%rohit%'");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
