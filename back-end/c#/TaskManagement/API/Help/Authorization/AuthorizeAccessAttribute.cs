using BOL;
using System.Net;
using System.Net.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;

namespace API.Help.Authorization
{
    public class AuthorizeAccessAttribute : AuthorizationFilterAttribute
    {
        private eStatus status;

        public AuthorizeAccessAttribute(eStatus status)
        {
            this.status = status;
        }
        public override void OnAuthorization(HttpActionContext actionContext)
        {
            try
            {
                eStatus status = eStatus.Nothing;
                User user = JsonWebToken.GetUser(actionContext.Request);
                status = GetUserStatus(user);
                if ((this.status & status)==0)
                {
                    actionContext.Response = actionContext.Request.CreateResponse(HttpStatusCode.Unauthorized, "Not allowed to access");
                }
            }
            catch
            {
                actionContext.Response = actionContext.Request.CreateResponse(HttpStatusCode.Unauthorized, "Not allowed to access");
            }
        }
      
        private eStatus GetUserStatus(User user)
        {
            if (user == null)
                return eStatus.Nothing;
            if (user.ManagerId == null)
            {
                return eStatus.Manager;
            }
            if (user.TeamLeaderId == null)
            {
                return eStatus.TeamLeader;
            }
            return eStatus.Worker;

        }
    }
}