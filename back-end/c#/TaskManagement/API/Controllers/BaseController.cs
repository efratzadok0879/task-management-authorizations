using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Web.Http.ModelBinding;

namespace API.Controllers
{
    public class BaseController : ApiController
    {
        public List<string> GetErrorList(List<ModelState> modelStateList)
        {
            try
            {
                List<string> errors = new List<string>();
                modelStateList.ForEach(value => value.Errors.ToList()
                    .ForEach(err => errors.Add(err.ErrorMessage)));
                return errors;
            }
            catch
            {
                return null;
            }
        }
    }
}
