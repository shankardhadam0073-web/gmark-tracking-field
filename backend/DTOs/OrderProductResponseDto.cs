using System;

namespace NavbharatAgroAPI.DTOs
{
    public class OrderProductResponseDto
    {
        public int Id { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public decimal UnitPrice { get; set; }
        public int Quantity { get; set; }
        public decimal RowTotal { get; set; }
    }
}
