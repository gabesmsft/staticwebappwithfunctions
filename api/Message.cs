using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;

namespace Api;

public class Message
{
    [Function("Message")]
    public IActionResult Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "message")] HttpRequest request)
    {
        return new OkObjectResult(new { text = "Hello from .NET 10 Azure Functions!" });
    }
}
