using System;

namespace NavbharatAgroAPI.DTOs
{
    public class RouteMasterResponseDto
    {
        public int Id { get; set; }
        public string RouteCode { get; set; } = string.Empty;
        public string RouteName { get; set; } = string.Empty;
        public string DayOfWeek { get; set; } = string.Empty;
        public int? AssignedEmployeeId { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}
