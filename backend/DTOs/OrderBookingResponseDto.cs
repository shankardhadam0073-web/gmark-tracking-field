using System;
using System.Collections.Generic;

namespace NavbharatAgroAPI.DTOs
{
    public class OrderBookingResponseDto
    {
        public int Id { get; set; }
        public int? EmployeeId { get; set; }
        public string? AssignedBy { get; set; }
        public string Route { get; set; } = string.Empty;
        public string CustomerName { get; set; } = string.Empty;
        public string? Village { get; set; }
        public string MobileNumber { get; set; } = string.Empty;
        public string? CustomerCategory { get; set; }
        public string OrderStatus { get; set; } = string.Empty;
        
        public decimal GrandTotal { get; set; }
        public DateOnly BookingDate { get; set; }
        public TimeOnly BookingTime { get; set; }
        public string? CancellationReason { get; set; }

        public double? Latitude { get; set; }

        public double? Longitude { get; set; }
        
        public List<OrderProductResponseDto> Products { get; set; } = new List<OrderProductResponseDto>();
        
        public string Message { get; set; } = "Retrieved Successfully";
    }
}
