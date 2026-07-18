using System;

namespace NavbharatAgroAPI.DTOs
{
    public class FieldVisitResponseDto
    {
        public int Id { get; set; }
        public int? EmployeeId { get; set; }
        public string? AssignedBy { get; set; }
        public string Route { get; set; } = string.Empty;
        public string CustomerName { get; set; } = string.Empty;
        public string? Village { get; set; }
        public string MobileNumber { get; set; } = string.Empty;
        public string? CustomerCategory { get; set; }
        public int? ProductId { get; set; }
        public string? ProductName { get; set; }
        public string? ShortNote { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public DateOnly VisitDate { get; set; }
        public TimeOnly VisitTime { get; set; }
        public string Message { get; set; } = "Retrieved Successfully";
    }
}
