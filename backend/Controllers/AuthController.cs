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

                if (string.IsNullOrEmpty(employee.PasswordHash) || employee.PasswordHash == "1234" || employee.PasswordHash == "0000")
                {
                    if (request.Password == "0000" || request.Password == "1234")
                    {
                        employee.PasswordHash = BCrypt.Net.BCrypt.HashPassword("0000");
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
                        
                        // Transition logic: if they enter 0000, and their current password hash is 1234, let them in and reset to 0000
                        if (!isValid && trimmedPassword == "0000" && BCrypt.Net.BCrypt.Verify("1234", employee.PasswordHash)) 
                        {
                            employee.PasswordHash = BCrypt.Net.BCrypt.HashPassword("0000");
                            await _context.SaveChangesAsync();
                            isValid = true;
                        }
                    }
                    catch
                    {
                        // Fallback if hash is invalid (e.g. plaintext)
                        if (trimmedPassword == employee.PasswordHash || (trimmedPassword == "0000" && employee.PasswordHash == "1234"))
                        {
                            // Reset to the new default 0000
                            employee.PasswordHash = BCrypt.Net.BCrypt.HashPassword("0000");
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
