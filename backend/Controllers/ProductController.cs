using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using NavbharatAgroAPI.Data;
using NavbharatAgroAPI.Models;
using NavbharatAgroAPI.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NavbharatAgroAPI.Controllers
{
    [Route("api/products")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<ProductController> _logger;

        public ProductController(AppDbContext context, ILogger<ProductController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<ProductResponseDto>))]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<IEnumerable<ProductResponseDto>>> GetProducts()
        {
            try
            {
                var products = await _context.Products.ToListAsync();
                return Ok(products.Select(p => new ProductResponseDto
                {
                    Id = p.Id,
                    ProductCode = p.ProductCode,
                    ProductName = p.ProductName,
                    DealerPrice = p.DealerPrice,
                    DairyFarmerPrice = p.DairyFarmerPrice,
                    IsActive = p.IsActive,
                    CreatedAt = p.CreatedAt,
                    Message = "Retrieved Successfully"
                }));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while getting all products.");
                return StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred.");
            }
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ProductResponseDto))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ProductResponseDto>> GetProduct(int id)
        {
            try
            {
                var product = await _context.Products.FindAsync(id);

                if (product == null)
                {
                    _logger.LogWarning("GetProduct: Product with Id {Id} was not found.", id);
                    return NotFound(new { message = $"Product with Id {id} not found." });
                }

                return Ok(new ProductResponseDto
                {
                    Id = product.Id,
                    ProductCode = product.ProductCode,
                    ProductName = product.ProductName,
                    DealerPrice = product.DealerPrice,
                    DairyFarmerPrice = product.DairyFarmerPrice,
                    IsActive = product.IsActive,
                    CreatedAt = product.CreatedAt,
                    Message = "Retrieved Successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while getting product with Id {Id}.", id);
                return StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred.");
            }
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(ProductResponseDto))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ProductResponseDto>> PostProduct(ProductRequestDto requestDto)
        {
            try
            {
                var product = new Product
                {
                    ProductCode = requestDto.ProductCode,
                    ProductName = requestDto.ProductName,
                    DealerPrice = requestDto.DealerPrice,
                    DairyFarmerPrice = requestDto.DairyFarmerPrice,
                    IsActive = requestDto.IsActive,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Products.Add(product);
                await _context.SaveChangesAsync();

                var responseDto = new ProductResponseDto
                {
                    Id = product.Id,
                    ProductCode = product.ProductCode,
                    ProductName = product.ProductName,
                    DealerPrice = product.DealerPrice,
                    DairyFarmerPrice = product.DairyFarmerPrice,
                    IsActive = product.IsActive,
                    CreatedAt = product.CreatedAt,
                    Message = "Product Created Successfully"
                };

                _logger.LogInformation("Product with Id {Id} created successfully.", product.Id);
                return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, responseDto);
            }
            catch (DbUpdateException ex)
            {
                _logger.LogWarning(ex, "PostProduct: Database update exception. Likely a duplicate ProductCode or constraint violation.");
                return Conflict(new { message = "A database conflict occurred. Please ensure ProductCode is unique.", details = ex.InnerException?.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while creating a new product.");
                return StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred.");
            }
        }

        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ProductResponseDto))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ProductResponseDto>> PutProduct(int id, ProductRequestDto requestDto)
        {
            if (id != requestDto.Id)
            {
                _logger.LogWarning("PutProduct: Route Id ({RouteId}) and Request Body Id ({BodyId}) do not match.", id, requestDto.Id);
                return BadRequest(new { message = "Route Id and Request Body Id do not match." });
            }

            try
            {
                var product = await _context.Products.FindAsync(id);
                if (product == null)
                {
                    _logger.LogWarning("PutProduct: Product with Id {Id} not found.", id);
                    return NotFound(new { message = $"Product with Id {id} not found." });
                }

                product.ProductCode = requestDto.ProductCode;
                product.ProductName = requestDto.ProductName;
                product.DealerPrice = requestDto.DealerPrice;
                product.DairyFarmerPrice = requestDto.DairyFarmerPrice;
                product.IsActive = requestDto.IsActive;

                _context.Entry(product).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                var responseDto = new ProductResponseDto
                {
                    Id = product.Id,
                    ProductCode = product.ProductCode,
                    ProductName = product.ProductName,
                    DealerPrice = product.DealerPrice,
                    DairyFarmerPrice = product.DairyFarmerPrice,
                    IsActive = product.IsActive,
                    CreatedAt = product.CreatedAt,
                    Message = "Product Updated Successfully"
                };

                _logger.LogInformation("Product with Id {Id} updated successfully.", id);
                return Ok(responseDto);
            }
            catch (DbUpdateConcurrencyException ex)
            {
                _logger.LogWarning(ex, "PutProduct: Concurrency exception for Product Id {Id}.", id);
                return NotFound(new { message = $"Product with Id {id} not found during update." });
            }
            catch (DbUpdateException ex)
            {
                _logger.LogWarning(ex, "PutProduct: Database update exception for Product Id {Id}. Likely a duplicate ProductCode.", id);
                return Conflict(new { message = "A database conflict occurred. Please ensure ProductCode is unique.", details = ex.InnerException?.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating product with Id {Id}.", id);
                return StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred.");
            }
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            try
            {
                var product = await _context.Products.FindAsync(id);
                if (product == null)
                {
                    _logger.LogWarning("DeleteProduct: Product with Id {Id} not found.", id);
                    return NotFound(new { message = $"Product with Id {id} not found." });
                }

                _context.Products.Remove(product);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Product with Id {Id} deleted successfully.", id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting product with Id {Id}.", id);
                return StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred.");
            }
        }
    }
}
