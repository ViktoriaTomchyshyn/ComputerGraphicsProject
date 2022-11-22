using Microsoft.AspNetCore.Mvc;

namespace CompGraphics.Controllers
{
    public class FractalsController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
