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
    [Route("api/routemasters")]
    [ApiController]
    public class RouteMasterController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<RouteMasterController> _logger;

        public RouteMasterController(AppDbContext context, ILogger<RouteMasterController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<RouteMasterResponseDto>))]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<IEnumerable<RouteMasterResponseDto>>> GetRouteMasters()
        {
            try
            {
                var routeMasters = await _context.RouteMasters.ToListAsync();
                return Ok(routeMasters.Select(rm => new RouteMasterResponseDto
                {
                    Id = rm.Id,
                    RouteCode = rm.RouteCode,
                    RouteName = rm.RouteName,
                    DayOfWeek = rm.DayOfWeek,
                    AssignedEmployeeId = rm.AssignedEmployeeId,
                    IsActive = rm.IsActive,
                    CreatedAt = rm.CreatedAt,
                    Message = "Retrieved Successfully"
                }));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while getting all route masters.");
                return StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred.");
            }
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(RouteMasterResponseDto))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<RouteMasterResponseDto>> GetRouteMaster(int id)
        {
            try
            {
                var routeMaster = await _context.RouteMasters.FindAsync(id);

                if (routeMaster == null)
                {
                    _logger.LogWarning("GetRouteMaster: RouteMaster with Id {Id} was not found.", id);
                    return NotFound(new { message = $"RouteMaster with Id {id} not found." });
                }

                return Ok(new RouteMasterResponseDto
                {
                    Id = routeMaster.Id,
                    RouteCode = routeMaster.RouteCode,
                    RouteName = routeMaster.RouteName,
                    DayOfWeek = routeMaster.DayOfWeek,
                    AssignedEmployeeId = routeMaster.AssignedEmployeeId,
                    IsActive = routeMaster.IsActive,
                    CreatedAt = routeMaster.CreatedAt,
                    Message = "Retrieved Successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while getting route master with Id {Id}.", id);
                return StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred.");
            }
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(RouteMasterResponseDto))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<RouteMasterResponseDto>> PostRouteMaster(RouteMasterRequestDto requestDto)
        {
            try
            {
                var routeMaster = new RouteMaster
                {
                    RouteCode = requestDto.RouteCode,
                    RouteName = requestDto.RouteName,
                    DayOfWeek = requestDto.DayOfWeek,
                    AssignedEmployeeId = requestDto.AssignedEmployeeId,
                    IsActive = requestDto.IsActive,
                    CreatedAt = DateTime.UtcNow
                };

                _context.RouteMasters.Add(routeMaster);
                await _context.SaveChangesAsync();

                var responseDto = new RouteMasterResponseDto
                {
                    Id = routeMaster.Id,
                    RouteCode = routeMaster.RouteCode,
                    RouteName = routeMaster.RouteName,
                    DayOfWeek = routeMaster.DayOfWeek,
                    AssignedEmployeeId = routeMaster.AssignedEmployeeId,
                    IsActive = routeMaster.IsActive,
                    CreatedAt = routeMaster.CreatedAt,
                    Message = "RouteMaster Created Successfully"
                };

                _logger.LogInformation("RouteMaster with Id {Id} created successfully.", routeMaster.Id);
                return CreatedAtAction(nameof(GetRouteMaster), new { id = routeMaster.Id }, responseDto);
            }
            catch (DbUpdateException ex)
            {
                _logger.LogWarning(ex, "PostRouteMaster: Database update exception. Likely a duplicate RouteCode or constraint violation.");
                return Conflict(new { message = "A database conflict occurred. Please ensure RouteCode is unique.", details = ex.InnerException?.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while creating a new route master.");
                return StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred.");
            }
        }

        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(RouteMasterResponseDto))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<RouteMasterResponseDto>> PutRouteMaster(int id, RouteMasterRequestDto requestDto)
        {
            if (id != requestDto.Id)
            {
                _logger.LogWarning("PutRouteMaster: Route Id ({RouteId}) and Request Body Id ({BodyId}) do not match.", id, requestDto.Id);
                return BadRequest(new { message = "Route Id and Request Body Id do not match." });
            }

            try
            {
                var routeMaster = await _context.RouteMasters.FindAsync(id);
                if (routeMaster == null)
                {
                    _logger.LogWarning("PutRouteMaster: RouteMaster with Id {Id} not found.", id);
                    return NotFound(new { message = $"RouteMaster with Id {id} not found." });
                }

                routeMaster.RouteCode = requestDto.RouteCode;
                routeMaster.RouteName = requestDto.RouteName;
                routeMaster.DayOfWeek = requestDto.DayOfWeek;
                routeMaster.AssignedEmployeeId = requestDto.AssignedEmployeeId;
                routeMaster.IsActive = requestDto.IsActive;

                _context.Entry(routeMaster).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                var responseDto = new RouteMasterResponseDto
                {
                    Id = routeMaster.Id,
                    RouteCode = routeMaster.RouteCode,
                    RouteName = routeMaster.RouteName,
                    DayOfWeek = routeMaster.DayOfWeek,
                    AssignedEmployeeId = routeMaster.AssignedEmployeeId,
                    IsActive = routeMaster.IsActive,
                    CreatedAt = routeMaster.CreatedAt,
                    Message = "RouteMaster Updated Successfully"
                };

                _logger.LogInformation("RouteMaster with Id {Id} updated successfully.", id);
                return Ok(responseDto);
            }
            catch (DbUpdateConcurrencyException ex)
            {
                _logger.LogWarning(ex, "PutRouteMaster: Concurrency exception for RouteMaster Id {Id}.", id);
                return NotFound(new { message = $"RouteMaster with Id {id} not found during update." });
            }
            catch (DbUpdateException ex)
            {
                _logger.LogWarning(ex, "PutRouteMaster: Database update exception for RouteMaster Id {Id}. Likely a duplicate RouteCode.", id);
                return Conflict(new { message = "A database conflict occurred. Please ensure RouteCode is unique.", details = ex.InnerException?.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating route master with Id {Id}.", id);
                return StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred.");
            }
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteRouteMaster(int id)
        {
            try
            {
                var routeMaster = await _context.RouteMasters.FindAsync(id);
                if (routeMaster == null)
                {
                    _logger.LogWarning("DeleteRouteMaster: RouteMaster with Id {Id} not found.", id);
                    return NotFound(new { message = $"RouteMaster with Id {id} not found." });
                }

                _context.RouteMasters.Remove(routeMaster);
                await _context.SaveChangesAsync();

                _logger.LogInformation("RouteMaster with Id {Id} deleted successfully.", id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting route master with Id {Id}.", id);
                return StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred.");
            }
        }
    }
}
