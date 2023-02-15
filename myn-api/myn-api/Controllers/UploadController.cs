using Microsoft.AspNetCore.Mvc;

namespace myn_api.Controllers;

[ApiController]
[Route("interviews")]
public class UploadController : ControllerBase
{
    readonly ILogger<UploadController> _logger;

    public UploadController(ILogger<UploadController> logger)
    {
        _logger = logger;
    }
    static string CreateTempFilePath()
    {
        var filename = $"{Guid.NewGuid()}.tmp";
        var directoryPath = Path.Combine("temp", "uploads");
        if (!Directory.Exists(directoryPath)) Directory.CreateDirectory(directoryPath);

        return Path.Combine(directoryPath, filename);
    }
    
    [HttpPost(Name = "interviews")]
    public async Task<IActionResult> OnPostUploadAsync(IFormFile file)
    {
        var tempFile = CreateTempFilePath();
        await using var stream = System.IO.File.OpenWrite(tempFile);
        await file.CopyToAsync(stream);
        await Console.Out.WriteLineAsync($"Saved File: {tempFile}");
        return Ok();
    }
}