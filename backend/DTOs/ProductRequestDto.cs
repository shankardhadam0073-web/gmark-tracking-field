using System.ComponentModel.DataAnnotations;

namespace NavbharatAgroAPI.DTOs
{
    public class ProductRequestDto
    {
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string ProductCode { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string ProductName { get; set; } = string.Empty;

        public decimal DealerPrice { get; set; }

        public decimal DairyFarmerPrice { get; set; }

        public bool IsActive { get; set; } = true;
    }
}
