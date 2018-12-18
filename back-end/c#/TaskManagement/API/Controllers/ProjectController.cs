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
    [RoutePrefix("api/project")]
    public class ProjectController : BaseController
    {
        [HttpPost]
        [Route("addProject")]
        [AuthorizeAccess(eStatus.Manager)]
        public HttpResponseMessage AddProject(Project newProject)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    bool created = ProjectService.AddProject(newProject);
                    return Request.CreateResponse(HttpStatusCode.Created, created);
                }
                List<string> errors = GetErrorList(ModelState.Values.ToList());

                return Request.CreateResponse(HttpStatusCode.BadRequest, errors);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
            }

        }

        [HttpGet]
        [Route("getProjectById")]
        [AuthorizeAccess(eStatus.TeamLeader)]
        public HttpResponseMessage GetProjectById(int projectId)
        {
            try
            {

                Project project = ProjectService.GetProjectById(projectId);
                ProjectService.AddDetailsToProject(project);
                return Request.CreateResponse(HttpStatusCode.OK, project);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex.Message);
            }
        }

        [HttpGet]
        [Route("getAllProjects")]
        [AuthorizeAccess(eStatus.Manager)]
        public HttpResponseMessage GetAllProjects()
        {
            try
            {

                List<Project> projects = ProjectService.GetAllProjects();
                return Request.CreateResponse(HttpStatusCode.OK, projects);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex.Message);
            }
        }

        [HttpGet]
        [Route("getProjectsByTeamLeaderId")]
        [AuthorizeAccess(eStatus.Manager|eStatus.TeamLeader)]
        public HttpResponseMessage getProjectsByTeamLeaderId(int TeamLeaderId)
        {
            try
            {
                List<Project> projects = ProjectService.GetProjectsByTeamLeaderId(TeamLeaderId);
                return Request.CreateResponse(HttpStatusCode.OK, projects);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex.Message);
            }
        }

        [HttpGet]
        [Route("getProjectsReports")]
        [AuthorizeAccess(eStatus.Manager)]
        public HttpResponseMessage GetProjectsReports()
        {
            try
            {

                List<Project> projects = ProjectService.GetProjectsReports();
                return Request.CreateResponse(HttpStatusCode.OK, projects);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex.Message);
            }
        }

        [HttpGet]
        [Route("hasProjects")]
        [AuthorizeAccess(eStatus.Manager)]
        public HttpResponseMessage HasProjects(int teamLeaderId)
        {
            try
            {
                bool hasProjects = ProjectService.HasProjects(teamLeaderId);
                return Request.CreateResponse(HttpStatusCode.OK, hasProjects);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex.Message);
            }
        }

        [HttpPost]
        [Route("checkUniqueValidation")]
        [AuthorizeAccess(eStatus.Manager)]
        public HttpResponseMessage CheckUniqueValidation(Project project)
        {
            try
            {
                if (ModelState.IsValid == false)
                {
                    List<string> errors = GetErrorList(ModelState.Values.ToList());
                    if (errors.Any(err => err == "ProjectName must be unique"))
                        return Request.CreateResponse(HttpStatusCode.OK, new { val = "project name must be unique" });
                }
                return Request.CreateResponse(HttpStatusCode.OK);

            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

    }
}
