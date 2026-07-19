using Microsoft.EntityFrameworkCore;
using NavbharatAgroAPI.Data;

// Disable default configuration reloads which trigger inotify watchers on Linux (Render)
Environment.SetEnvironmentVariable("DOTNET_hostBuilder__reloadConfigOnChange", "false");
// Force polling instead of native inotify watchers globally if any watcher is still created
Environment.SetEnvironmentVariable("DOTNET_USE_POLLING_FILE_WATCHER", "1");

var builder = WebApplication.CreateBuilder(args);

// Clear default configuration sources to prevent any hidden file watchers
builder.Configuration.Sources.Clear();
// 1. Read from Environment Variables first (highest priority)
builder.Configuration.AddEnvironmentVariables();
// 2. Fallback to appsettings.json without reloadOnChange
builder.Configuration.AddJsonFile("appsettings.json", optional: true, reloadOnChange: false);
builder.Configuration.AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true, reloadOnChange: false);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// Configure Swagger (Development Only)
if (builder.Environment.IsDevelopment())
{
    builder.Services.AddSwaggerGen(c =>
    {
        var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
        var xmlPath = System.IO.Path.Combine(AppContext.BaseDirectory, xmlFile);
        if (System.IO.File.Exists(xmlPath))
        {
            c.IncludeXmlComments(xmlPath);
        }
    });
}

builder.Services.AddControllers();

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

// Auto-migrate the database safely on startup
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        if (context.Database.GetPendingMigrations().Any())
        {
            // Temporarily disabled as per user request to prevent Render startup failures
            // context.Database.Migrate();
        }
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while migrating the database. The application will continue running.");
    }
}

// Ensure Swagger works in Development Only
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Navbharat Agro API V1");
        // Serve swagger UI at /swagger and /swagger/index.html
        c.RoutePrefix = "swagger";
    });
}

// Production standard middleware ordering
app.UseRouting();
app.UseCors("AllowFrontend");
app.MapControllers();

// Render Health Check Endpoint
app.MapGet("/health", () => Results.Ok(new { status = "Healthy", environment = app.Environment.EnvironmentName }));

app.Run();
