using BLL;
using Newtonsoft.Json.Serialization;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Threading.Tasks;

namespace API
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {

            //config.Filters.Add(new AuthorizeAttribute());

            var cors = new EnableCorsAttribute("*", "*", "*");
            config.EnableCors();

            GlobalConfiguration.Configuration.Formatters.JsonFormatter.SerializerSettings
            .ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
            GlobalConfiguration.Configuration.Formatters
                .Remove(GlobalConfiguration.Configuration.Formatters.XmlFormatter);

            config.Formatters.Remove(config.Formatters.XmlFormatter);
            config.Formatters.JsonFormatter.SerializerSettings.
                ContractResolver = new CamelCasePropertyNamesContractResolver();

            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            Task.Run(BaseService.DeadLineEmail);
            Task.Run(UserService.DeleteToken);
        }


    }
}
