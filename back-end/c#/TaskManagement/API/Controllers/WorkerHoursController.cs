using BOL;
using BLL;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using API.Help.Authorization;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;


namespace API.Controllers
{
    [EnableCors("*", "*", "*")]
    [RoutePrefix("api/workerHours")]
    public class WorkerHoursController : BaseController
    {
        [HttpGet]
        [Route("getAllWorkerHours")]
        [AuthorizeAccess(eStatus.Worker)]
        public HttpResponseMessage GetAllWorkerHours(int workerId)
        {
            try
            {
                List<WorkerHours> workerHoursList = WorkerHoursService.GetAllWorkerHours(workerId);
                return Request.CreateResponse(HttpStatusCode.OK, workerHoursList);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex.Message);
            }
        }

        [HttpPut]
        [Route("editWorkerHours")]
        [AuthorizeAccess(eStatus.TeamLeader)]
        public HttpResponseMessage EditWorkerHours(WorkerHours workerHours)
        {
            try
            {
                bool edited = WorkerHoursService.EditWorkerHours(workerHours);
                return Request.CreateResponse(HttpStatusCode.OK, edited);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }
       
        [HttpPost]
        [Route("hasUncomletedHours")]
        [AuthorizeAccess(eStatus.Manager)]
        public HttpResponseMessage HasUncomletedHours()
        {
            try
            {
                int workerId =int.Parse(HttpContext.Current.Request.Form["workerId"]);
                JsonSerializerSettings jsonSerializerSettings = new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() };
                List<int> projectIdList = JsonConvert.DeserializeObject <List<int>>(HttpContext.Current.Request.Form["projectIdList"]);

                bool hasUncomletedHours = WorkerHoursService.HasUncomletedHours(workerId, projectIdList);
                return Request.CreateResponse(HttpStatusCode.OK, hasUncomletedHours);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }
    }
}
