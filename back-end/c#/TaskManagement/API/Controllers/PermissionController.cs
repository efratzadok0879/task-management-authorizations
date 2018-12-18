using API.Help.Authorization;
using BOL;
using BLL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;


namespace API.Controllers
{
    [EnableCors("*", "*", "*")]
    [RoutePrefix("api/permission")]
    public class PermissionController : BaseController
    {
        [HttpPost]
        [Route("addPermission")]
        [AuthorizeAccess(eStatus.Manager)]
        public HttpResponseMessage AddPermission(Permission permission)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    int permissionId = PermissionService.AddPermission(permission);
                    return Request.CreateResponse(HttpStatusCode.Created, permissionId);
                }
                List<string> errors = GetErrorList(ModelState.Values.ToList());

                return Request.CreateResponse(HttpStatusCode.BadRequest, errors);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
            }

        }

        [HttpPost]
        [Route("deletePermission")]
        [AuthorizeAccess(eStatus.Manager)]
        public HttpResponseMessage DeletePermission(int permissionId)
        {
            try
            {
                bool deleted = PermissionService.DeletePermission(permissionId);
                return Request.CreateResponse(HttpStatusCode.OK, deleted);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }
    }
}
