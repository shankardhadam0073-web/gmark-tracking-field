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
    /// <summary>
    /// Manages Employee records in the Navbharat Agro system.
    /// </summary>
    [Route("api/employees")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<EmployeeController> _logger;

        public EmployeeController(AppDbContext context, ILogger<EmployeeController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Retrieves a list of all employees.
        /// </summary>
        /// <returns>A list of EmployeeResponseDto.</returns>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<EmployeeResponseDto>))]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<IEnumerable<EmployeeResponseDto>>> GetEmployees()
        {
            try
            {
                var employees = await _context.Employees.ToListAsync();
                return Ok(employees.Select(e => new EmployeeResponseDto
                {
                    Id = e.Id,
                    Name = e.Name,
                    EmployeeCode = e.EmployeeCode,
                    MobileNumber = e.MobileNumber,
                    AssignedArea = e.AssignedArea,
                    CreatedAt = e.CreatedAt,
                    Message = "Retrieved Successfully"
                }));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while getting all employees.");
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An unexpected error occurred.", details = ex.Message, inner = ex.InnerException?.Message });
            }
        }

        /// <summary>
        /// Retrieves a specific employee by their unique ID.
        /// </summary>
        /// <param name="id">The unique identifier of the employee.</param>
        /// <returns>The EmployeeResponseDto.</returns>
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(EmployeeResponseDto))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<EmployeeResponseDto>> GetEmployee(int id)
        {
            try
            {
                var employee = await _context.Employees.FindAsync(id);

                if (employee == null)
                {
                    _logger.LogWarning("GetEmployee: Employee with Id {Id} was not found.", id);
                    return NotFound(new { message = $"Employee with Id {id} not found." });
                }

                return Ok(new EmployeeResponseDto
                {
                    Id = employee.Id,
                    Name = employee.Name,
                    EmployeeCode = employee.EmployeeCode,
                    MobileNumber = employee.MobileNumber,
                    AssignedArea = employee.AssignedArea,
                    CreatedAt = employee.CreatedAt,
                    Message = "Retrieved Successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while getting employee with Id {Id}.", id);
                return StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred.");
            }
        }

        /// <summary>
        /// Creates a new employee record.
        /// </summary>
        /// <param name="requestDto">The details of the new employee.</param>
        /// <returns>The created EmployeeResponseDto.</returns>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(EmployeeResponseDto))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<EmployeeResponseDto>> PostEmployee(EmployeeRequestDto requestDto)
        {
            try
            {
                if (EmployeeExists(requestDto.Id))
                {
                    _logger.LogWarning("PostEmployee: Attempted to create duplicate employee with Id {Id}.", requestDto.Id);
                    return Conflict(new { message = $"Employee with Id {requestDto.Id} already exists." });
                }

                var employee = new Employee
                {
                    Id = requestDto.Id,
                    Name = requestDto.Name,
                    EmployeeCode = requestDto.EmployeeCode,
                    MobileNumber = requestDto.MobileNumber,
                    AssignedArea = requestDto.AssignedArea,
                    CreatedAt = DateTime.UtcNow,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("1234"),
                    IsActive = true
                };

                _context.Employees.Add(employee);
                await _context.SaveChangesAsync();

                var responseDto = new EmployeeResponseDto
                {
                    Id = employee.Id,
                    Name = employee.Name,
                    EmployeeCode = employee.EmployeeCode,
                    MobileNumber = employee.MobileNumber,
                    AssignedArea = employee.AssignedArea,
                    CreatedAt = employee.CreatedAt,
                    Message = "Employee Created Successfully"
                };

                _logger.LogInformation("Employee with Id {Id} created successfully.", employee.Id);
                return CreatedAtAction(nameof(GetEmployee), new { id = employee.Id }, responseDto);
            }
            catch (DbUpdateException ex)
            {
                _logger.LogWarning(ex, "PostEmployee: Database update exception. Likely a duplicate EmployeeCode or constraint violation.");
                return Conflict(new { message = "A database conflict occurred. Please ensure EmployeeCode is unique.", details = ex.InnerException?.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while creating a new employee.");
                return StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred.");
            }
        }

        /// <summary>
        /// Updates an existing employee's details.
        /// </summary>
        /// <param name="id">The unique identifier of the employee to update.</param>
        /// <param name="requestDto">The updated employee details.</param>
        /// <returns>A success message.</returns>
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(EmployeeResponseDto))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<EmployeeResponseDto>> PutEmployee(int id, EmployeeRequestDto requestDto)
        {
            if (id != requestDto.Id)
            {
                _logger.LogWarning("PutEmployee: Route Id ({RouteId}) and Request Body Id ({BodyId}) do not match.", id, requestDto.Id);
                return BadRequest(new { message = "Route Id and Request Body Id do not match." });
            }

            try
            {
                var employee = await _context.Employees.FindAsync(id);
                if (employee == null)
                {
                    _logger.LogWarning("PutEmployee: Employee with Id {Id} not found.", id);
                    return NotFound(new { message = $"Employee with Id {id} not found." });
                }

                employee.Name = requestDto.Name;
                employee.EmployeeCode = requestDto.EmployeeCode;
                employee.MobileNumber = requestDto.MobileNumber;
                employee.AssignedArea = requestDto.AssignedArea;

                _context.Entry(employee).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                var responseDto = new EmployeeResponseDto
                {
                    Id = employee.Id,
                    Name = employee.Name,
                    EmployeeCode = employee.EmployeeCode,
                    MobileNumber = employee.MobileNumber,
                    AssignedArea = employee.AssignedArea,
                    CreatedAt = employee.CreatedAt,
                    Message = "Employee Updated Successfully"
                };

                _logger.LogInformation("Employee with Id {Id} updated successfully.", id);
                return Ok(responseDto);
            }
            catch (DbUpdateConcurrencyException ex)
            {
                _logger.LogWarning(ex, "PutEmployee: Concurrency exception for Employee Id {Id}.", id);
                return NotFound(new { message = $"Employee with Id {id} not found during update." });
            }
            catch (DbUpdateException ex)
            {
                _logger.LogWarning(ex, "PutEmployee: Database update exception for Employee Id {Id}. Likely a duplicate EmployeeCode.", id);
                return Conflict(new { message = "A database conflict occurred. Please ensure EmployeeCode is unique.", details = ex.InnerException?.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating employee with Id {Id}.", id);
                return StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred.");
            }
        }

        /// <summary>
        /// Deletes an employee from the system.
        /// </summary>
        /// <param name="id">The unique identifier of the employee to delete.</param>
        /// <returns>No content on success.</returns>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            try
            {
                var employee = await _context.Employees.FindAsync(id);
                if (employee == null)
                {
                    _logger.LogWarning("DeleteEmployee: Employee with Id {Id} not found.", id);
                    return NotFound(new { message = $"Employee with Id {id} not found." });
                }

                _context.Employees.Remove(employee);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Employee with Id {Id} deleted successfully.", id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting employee with Id {Id}.", id);
                return StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred.");
            }
        }

        private bool EmployeeExists(int id)
        {
            return _context.Employees.Any(e => e.Id == id);
        }
    }
}
