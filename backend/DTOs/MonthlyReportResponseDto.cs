namespace NavbharatAgroAPI.DTOs
{
    public class MonthlyReportResponseDto
    {
        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; } = string.Empty;
        public int TotalOrders { get; set; }
        public int PendingOrders { get; set; }
        public int DeliveredOrders { get; set; }
        public decimal TotalSales { get; set; }
        public int TotalFieldVisits { get; set; }
        public int TotalQuantitySold { get; set; }
        public string ProductsSold { get; set; } = string.Empty;
    }
}
