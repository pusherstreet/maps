using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.IO;

namespace maps.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            string key = GetApiKey();
            return View((object)key);
        }
        private string GetApiKey()
        {
            return System.IO.File.ReadAllText(Server.MapPath("~/key.txt"));
        }

    }
}