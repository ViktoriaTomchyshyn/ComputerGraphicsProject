using Microsoft.AspNetCore.Mvc;

namespace CompGraphics.Controllers
{
    public class StudyComponentController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
