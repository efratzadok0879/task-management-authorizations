using API.Help.Authorization;
using BOL;
using BOL.Help;
using BLL;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;


namespace API.Controllers
{
    [EnableCors("*", "*", "*")]
    [RoutePrefix("api/user")]
    public class UserController : BaseController
    {

        [HttpPost]
        [Route("login")]
        public HttpResponseMessage Login(Login login)
        {
            try

            {
                if (ModelState.IsValid)
                {
                    User user = UserService.Login(login.Email, login.Password);
                    if (user != null)
                    {
                        string token = JsonWebToken.CreateToken(user.Password + user.Email);
                        user.Password = string.Empty;
                        HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, user);
                        HttpContext.Current.Response.AddHeader("Access-Control-Expose-Headers", "token");
                        response.Headers.Add("token", token);

                        return response;
                    }
                    return Request.CreateResponse(HttpStatusCode.NotFound, "Email or password is not correct");
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
        [Route("getAllUsers")]
        [AuthorizeAccess(eStatus.Manager)]
        public HttpResponseMessage GetAllUsers(int managerId)
        {
            try
            {
                List<User> users = UserService.GetAllManagerUsers(managerId);
                return Request.CreateResponse(HttpStatusCode.OK, users);
            }

            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex.Message);
            }
        }

        [HttpGet]
        [Route("getAllTeamUsers")]
        [AuthorizeAccess(eStatus.Manager)]
        public HttpResponseMessage GetAllTeamUsers(int teamLeaderId)
        {
            try
            {
                List<User> users = UserService.GetAllTeamUsers(teamLeaderId);
                return Request.CreateResponse(HttpStatusCode.OK, users);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex.Message);
            }
        }

        [HttpGet]
        [Route("getAllTeamLeaders")]
        [AuthorizeAccess(eStatus.Manager)]
        public HttpResponseMessage GetAllTeamLeaders(int managerId)
        {
            try
            {
                List<User> teamLeaders = UserService.GetAllTeamLeaders(managerId);
                return Request.CreateResponse(HttpStatusCode.OK, teamLeaders);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex.Message);
            }
        }

        [HttpGet]
        [Route("getUser")]
        public HttpResponseMessage GetUser()
        {
            try
            {
                User user =JsonWebToken.GetUser(Request);
                return Request.CreateResponse(HttpStatusCode.OK, user);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex.Message);
            }
        }

        [HttpGet]
        [Route("getUserById")]
        [AuthorizeAccess(eStatus.Manager)]
        public HttpResponseMessage GetUserById(int userId)
        {
            try
            {
                User user = UserService.GetUserById(userId);
                return Request.CreateResponse(HttpStatusCode.OK, user);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex.Message);
            }
        }

        [HttpGet]
        [Route("getUserByEmail")]
        public HttpResponseMessage GetUserByEmail(string email)
        {
            try
            {
                User user = UserService.GetUserByEmail(email);
                return Request.CreateResponse(HttpStatusCode.OK, user);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex.Message);
            }
        }

        [HttpPost]
        [Route("addUser")]
        [AuthorizeAccess(eStatus.Manager)]
        public HttpResponseMessage AddUser(User newUser)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    bool created = UserService.AddUser(newUser);
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

        [HttpPut]
        [Route("editUser")]
        [AuthorizeAccess(eStatus.Manager)]
        public HttpResponseMessage EditUser(User user)
        {
            try
            {
                ModelState.Remove("user.Password");
                ModelState.Remove("user.ConfirmPassword");
                if (ModelState.IsValid)
                {
                    bool edited = UserService.EditUser(user);
                    return Request.CreateResponse(HttpStatusCode.OK, edited);
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
        [Route("deleteUser")]
        [AuthorizeAccess(eStatus.Manager)]
        public HttpResponseMessage DeleteUser(int userId)
        {
            try
            {
                bool deleted = UserService.DeleteUser(userId);
                return Request.CreateResponse(HttpStatusCode.OK, deleted);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpPost]
        [Route("uploadImageProfile")]
        [AuthorizeAccess(eStatus.Manager)]
        public HttpResponseMessage UploadImageProfile()
        {
            try
            {
                string originalFileName = HttpContext.Current.Request.Files[0].FileName;
                string newFileName = Guid.NewGuid().ToString() + Path.GetExtension(originalFileName);
                string fullPathAndFileName = HttpContext.Current.Server.MapPath("~/Images/UsersProfiles/" + newFileName);
                HttpContext.Current.Request.Files[0].SaveAs(fullPathAndFileName);
                return Request.CreateResponse(HttpStatusCode.Created, newFileName);

            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpPost]
        [Route("removeUploadedImage")]
        [AuthorizeAccess(eStatus.Manager)]
        public HttpResponseMessage RemoveUploadedImage()
        {
            try
            {
                string profileImageName = HttpContext.Current.Request.Form["profileImageName"];
                bool moveToArchives = bool.Parse(HttpContext.Current.Request.Form["moveToArchives"]);
                string fullPath = AppDomain.CurrentDomain.BaseDirectory;
                string sourceFile = fullPath + "Images/UsersProfiles/" + profileImageName;

                if (moveToArchives == true)
                {
                    string destinationFile = fullPath + "Images/Archives/UsersProfiles/" + profileImageName;
                    File.Move(sourceFile, destinationFile);
                }
                else
                {
                    File.Delete(sourceFile);
                }
                return Request.CreateResponse(HttpStatusCode.Created, true);
            }

            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpPost]
        [Route("sendEmail")]
        [AuthorizeAccess(eStatus.Worker)]
        public HttpResponseMessage SendEmail()
        {
            try
            {
                JsonSerializerSettings jsonSerializerSettings = new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() };
                Email email = JsonConvert.DeserializeObject<Email>(HttpContext.Current.Request.Form["email"], jsonSerializerSettings);
                User user = JsonConvert.DeserializeObject<User>(HttpContext.Current.Request.Form["user"], jsonSerializerSettings);
                bool created = UserService.SendEmail(email, user);
                return Request.CreateResponse(HttpStatusCode.Created, created);
            }

            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpPost]
        [Route("checkUniqueValidations")]
        [AuthorizeAccess(eStatus.Manager)]
        public HttpResponseMessage CheckUniqueValidations(User user)
        {
            try
            {
                if (ModelState.IsValid == false)
                {
                    List<string> errors = GetErrorList(ModelState.Values.ToList());
                    string errorMessage = errors.FirstOrDefault(err => err == "Password must be unique" || err == "Email must be unique");
                    if (errorMessage != null)
                        return Request.CreateResponse(HttpStatusCode.OK, new { val = errorMessage.ToLower() });
                }
                return Request.CreateResponse(HttpStatusCode.OK);

            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpGet]
        [Route("hasWorkers")]
        [AuthorizeAccess(eStatus.Manager)]
        public HttpResponseMessage HasWorkers(int teamLeaderId)
        {
            try
            {
                bool hasWorkes = UserService.HasWorkers(teamLeaderId);
                return Request.CreateResponse(HttpStatusCode.OK, hasWorkes);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex.Message);
            }
        }

        [HttpPost]
        [Route("forgotPassword")]
        public HttpResponseMessage ForgotPassword(string email)
        {
            try
            {
                bool isExist = UserService.ForgotPassword(email);
                return Request.CreateResponse(HttpStatusCode.OK, isExist);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpPost]
        [Route("confirmToken")]
        public HttpResponseMessage ConfirmToken(ChangePassword changePassword)
        {
            try
            {
                bool confirmed = UserService.ConfirmToken(changePassword);
                return Request.CreateResponse(HttpStatusCode.OK, confirmed);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpPut]
        [Route("changePassword")]
        public HttpResponseMessage ChangePassword(User user)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    bool edited = UserService.ChangePassword(user);
                    return Request.CreateResponse(HttpStatusCode.OK, edited);
                }
                List<string> errors = GetErrorList(ModelState.Values.ToList());

                return Request.CreateResponse(HttpStatusCode.BadRequest, errors);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

    }
}
