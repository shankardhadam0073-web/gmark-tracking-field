using System.ComponentModel.DataAnnotations;

namespace NavbharatAgroAPI.DTOs
{
    public class CancelOrderDto
    {
        [Required]
        [StringLength(500)]
        public string Reason { get; set; } = string.Empty;
    }
}
