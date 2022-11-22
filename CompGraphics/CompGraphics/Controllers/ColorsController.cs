using Microsoft.AspNetCore.Mvc;

namespace CompGraphics.Controllers
{
    public class ColorsController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
