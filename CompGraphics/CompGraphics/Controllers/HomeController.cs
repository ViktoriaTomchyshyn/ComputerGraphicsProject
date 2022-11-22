using Microsoft.AspNetCore.Mvc;

namespace CompGraphics.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

    }
}
