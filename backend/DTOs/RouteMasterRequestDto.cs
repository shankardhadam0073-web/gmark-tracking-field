using System.ComponentModel.DataAnnotations;

namespace NavbharatAgroAPI.DTOs
{
    public class RouteMasterRequestDto
    {
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string RouteCode { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string RouteName { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string DayOfWeek { get; set; } = string.Empty;

        public int? AssignedEmployeeId { get; set; }

        public bool IsActive { get; set; } = true;
    }
}
