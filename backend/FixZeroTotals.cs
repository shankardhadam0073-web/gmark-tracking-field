using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using NavbharatAgroAPI.Data;
using NavbharatAgroAPI.Models;
using Microsoft.Extensions.DependencyInjection;

namespace NavbharatAgroAPI.Scripts
{
    public class FixZeroTotals
    {
        public static async Task Run(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var _context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            var orders = await _context.OrderBookings
                .Include(o => o.OrderProducts)
                .Where(o => o.GrandTotal == 0)
                .ToListAsync();

            var products = await _context.Products.ToListAsync();

            Console.WriteLine($"Found {orders.Count} orders with GrandTotal == 0.");

            foreach (var order in orders)
            {
                decimal newGrandTotal = 0;
                foreach (var op in order.OrderProducts)
                {
                    if (op.UnitPrice == 0)
                    {
                        var prod = products.FirstOrDefault(p => p.ProductName.Trim().Equals(op.ProductName.Trim(), StringComparison.OrdinalIgnoreCase));
                        if (prod != null)
                        {
                            decimal price = order.CustomerCategory?.ToLower() == "dairy farmer" ? prod.DairyFarmerPrice : prod.DealerPrice;
                            op.UnitPrice = price;
                            op.RowTotal = price * op.Quantity;
                        }
                    }
                    newGrandTotal += op.RowTotal;
                }

                if (newGrandTotal > 0)
                {
                    order.GrandTotal = newGrandTotal;
                    Console.WriteLine($"Updating Order {order.Id} GrandTotal to {newGrandTotal}");
                }
            }

            await _context.SaveChangesAsync();
            Console.WriteLine("Done.");
        }
    }
}
