using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using NavbharatAgroAPI.Data;
using NavbharatAgroAPI.DTOs;
using System;
using System.Threading.Tasks;

namespace NavbharatAgroAPI.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<AuthController> _logger;

        public AuthController(AppDbContext context, ILogger<AuthController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpPost("employee-login")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(LoginResponseDto))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<LoginResponseDto>> EmployeeLogin(LoginRequestDto request)
        {
            try
            {
                var employee = await _context.Employees.FindAsync(request.EmployeeId);
                
                if (employee == null || !employee.IsActive)
                {
                    return Unauthorized(new { message = "Invalid Password" });
                }

                if (string.IsNullOrEmpty(employee.PasswordHash) || employee.PasswordHash == "1234")
                {
                    if (request.Password == "1234")
                    {
                        employee.PasswordHash = BCrypt.Net.BCrypt.HashPassword("1234");
                        await _context.SaveChangesAsync();
                    }
                    else
                    {
                        return Unauthorized(new { message = "Invalid Password" });
                    }
                }
                else 
                {
                    bool isValid = false;
                    var trimmedPassword = request.Password?.Trim();
                    try 
                    {
                        isValid = BCrypt.Net.BCrypt.Verify(trimmedPassword, employee.PasswordHash);
                    }
                    catch
                    {
                        // Fallback if hash is invalid (e.g. plaintext)
                        if (trimmedPassword == employee.PasswordHash)
                        {
                            employee.PasswordHash = BCrypt.Net.BCrypt.HashPassword(trimmedPassword);
                            await _context.SaveChangesAsync();
                            isValid = true;
                        }
                    }

                    if (!isValid)
                    {
                        return Unauthorized(new { message = "Invalid Password" });
                    }
                }

                var token = Guid.NewGuid().ToString();

                return Ok(new LoginResponseDto
                {
                    EmployeeId = employee.Id,
                    EmployeeName = employee.Name,
                    Token = token,
                    Message = "Login Successful"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during employee login.");
                return StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred.");
            }
        }

    }
}
