using BOL;
using BOL.Help;
using System;
using System.Text;
using System.Net.Mail;
using System.Net;
using MySql.Data.MySqlClient;
using System.Collections.Generic;
using System.Linq;
using System.Timers;
using System.Configuration;
using System.Threading;
using System.Threading.Tasks;

namespace BLL
{
    public static class BaseService
    {
        public static string GetStringValueOrNull(string value)
        {
            return value != null ? $"'{value}'" : "null";
        }

        public static string GetIntValueOrNull(int? value)
        {
            return value != null ? $"{value}" : "null";
        }

        public static string FormatDate(DateTime date,string format="yyyy-MM-dd")
        {
            return $"'{date.ToString(format)}'";
        }

        public static bool SendEmail(Email email)
        {
            try
            {
                SmtpClient smtpClient = new SmtpClient("smtp.gmail.com", 587);
                smtpClient.EnableSsl = true;
                smtpClient.Timeout = 1000000;
                smtpClient.UseDefaultCredentials = false;

                NetworkCredential basicCredential = new NetworkCredential(email.CompanyName,email.CompanyPassword);
                smtpClient.Credentials = basicCredential;

                MailMessage mailMessage = new MailMessage();
                mailMessage.From = new MailAddress(email.CompanyName);
                email.ToAddress.ForEach(toAddress => mailMessage.To.Add(toAddress));
                mailMessage.Subject = email.Subject;
                mailMessage.Body = email.Body;
                mailMessage.BodyEncoding = Encoding.UTF8;
                smtpClient.Send(mailMessage);
                return true;
            }
            catch
            {
                return false;
            }
        }

        public static async Task DeadLineEmail()
        {
            // Set up a timer that triggers every day.
            System.Timers.Timer timer = new System.Timers.Timer();
            //timer.Interval = 60000 * 60 * 24; // one day
            timer.Interval = 60000;

            timer.Elapsed += new ElapsedEventHandler(OnStart);

            string time = ConfigurationManager.AppSettings["deadLineEmailHour"];
            int hour = int.Parse(time.Split(':')[0]);
            int minute = int.Parse(time.Split(':')[1]);

            DateTime currentDateTime = DateTime.Now;
            DateTime dateTimeToStart = currentDateTime.Date + new TimeSpan(hour, minute, 0);
            if (dateTimeToStart < currentDateTime)
                dateTimeToStart= dateTimeToStart.AddDays(1);
            TimeSpan timeout = dateTimeToStart - currentDateTime;
            Thread.Sleep(timeout);
            timer.Start();
        }

        public static void OnStart(object sender, ElapsedEventArgs args)
        {
            sendDeadLineEmail();
        }

        public static void sendDeadLineEmail()
        {
            List<Project> projects = ProjectService.GetAllProjects(DateTime.Today);
            projects.ForEach(project =>
            {
                Email emailToTeamLeader = new Email() { Subject = "Deadline is Here!!", Body = $"Your project {project.ProjectName} is finish tomorrow!\n please pay attention to verify your workers finished their task." };
                Email emailToWorkers = new Email() { Subject = "Deadline is Here!!", Body = $"Your project {project.ProjectName} is finish tomorrow!\n please pay attention to finish your task." };

                List<WorkerHours> workerHoursList = WorkerHoursService.GetUncompletedWorkersHours(project.ProjectId);
                List<string> emailAddresses = workerHoursList.Select(workerHours => workerHours.Worker.Email).ToList();
                emailToWorkers.ToAddress.AddRange(emailAddresses);
                if (workerHoursList.Count > 0)
                    emailToTeamLeader.ToAddress.Add(UserService.GetUserById(project.TeamLeaderId).Email);
                SendEmail(emailToWorkers);
                SendEmail(emailToTeamLeader);
            });
        }
       
        public static Customer InitCustomer(MySqlDataReader reader)
        {
            try
            {
                Customer customer = new Customer
                {
                    CustomerId = reader.GetInt32(0),
                    CustomerName = reader.GetString(1)
                };
                return customer;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static Department InitDepartment(MySqlDataReader reader)
        {
            try
            {
                Department department = new Department
                {
                    DepartmentId = reader.GetInt32(0),
                    DepartmentName = reader.GetString(1),
                };
                return department;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static DepartmentHours InitDepartmentHours(MySqlDataReader reader)
        {
            DepartmentHours departmentHours = new DepartmentHours
            {
                DepartmentHoursId = reader.GetInt32(0),
                ProjectId = reader.GetInt32(1),
                DepartmentId = reader.GetInt32(2),
                NumHours = reader.GetInt32(3),
                Department = new Department { DepartmentName = reader.GetString(4) }
            };
            return departmentHours;
        }

        public static Permission InitPermission(MySqlDataReader reader)
        {
            try
            {
                Permission Permission = new Permission
                {
                    PermissionId = reader.GetInt32(0),
                    WorkerId = reader.GetInt32(1),
                    ProjectId = reader.GetInt32(2),
                    IsActive = reader.GetBoolean(3)
                };
                if(reader.FieldCount == 6)
                {
                    Permission.Worker = new User() { UserName = reader.GetString(4) };
                    Permission.Project = new Project() { ProjectName = reader.GetString(5) };
                }
               
                return Permission;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static PresenceHours initPresenceHours(MySqlDataReader reader)
        {
            try
            {
                PresenceHours presenceHours = new PresenceHours
                {
                    PresenceHoursId = reader.GetInt32(0),
                    WorkerId = reader.GetInt32(1),
                    ProjectId = reader.GetInt32(2),
                    StartHour = reader.GetDateTime(3),
                    EndHour = reader.GetDateTime(4),
                    Worker = new User() { UserName = reader.GetString(5) }
                };
                return presenceHours;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static Project InitProject(MySqlDataReader reader)
        {
            Project project = new Project
            {
                ProjectId = reader.GetInt32(0),
                ProjectName = reader.GetString(1),
                ManagerId = reader.GetInt32(2),
                CustomerId = reader.GetInt32(3),
                TeamLeaderId = reader.GetInt32(4),
                TotalHours = reader.GetInt32(5),
                StartDate = reader.GetDateTime(6),
                EndDate = reader.GetDateTime(7),
                IsComplete=reader.GetBoolean(8)
            };
            if (reader.FieldCount == 12)
            {
                project.Customer = new Customer { CustomerName = reader.GetString(9) };
                project.TeamLeader = new User { UserName = reader.GetString(10), Email = reader.GetString(11) };
            }
            return project;
        }

        public static User InitUser(MySqlDataReader reader)
        {
            try
            {
                User user = new User
                {
                    UserId = reader.GetInt32(0),
                    UserName = reader.GetString(1),
                    Email = reader.GetString(2),
                    Password = reader.GetString(3),
                    ProfileImageName = reader.IsDBNull(4) ? default(string) :
                                  reader.GetString(4),
                    DepartmentId = reader.IsDBNull(5) ? default(int?) :
                                      reader.GetInt32(5),
                    TeamLeaderId = reader.IsDBNull(6) ? default(int?) :
                                      reader.GetInt32(6),
                    ManagerId = reader.IsDBNull(7) ? default(int?) :
                                      reader.GetInt32(7),
                    IsActive = reader.GetBoolean(8),
                };
                if (reader.FieldCount == 11 && reader.IsDBNull(9) == false)
                {
                    user.Department = new Department { DepartmentName = reader.GetString(9) };
                }
                if (reader.FieldCount == 11 && reader.IsDBNull(10) == false)
                {
                    user.TeamLeader = new User { UserName = reader.GetString(10) };
                }
                return user;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static WorkerHours InitWorkerHours(MySqlDataReader reader)
        {
            try
            {
                WorkerHours workerHours = new WorkerHours
                {
                    WorkerHoursId = reader.GetInt32(0),
                    ProjectId = reader.GetInt32(1),
                    WorkerId = reader.GetInt32(2),
                    NumHours = reader.GetInt32(3),
                    IsComplete=reader.GetBoolean(4),
                    Project = new Project { ProjectName = reader.GetString(6) },
                    Worker = new User { UserName = reader.GetString(7),Email=reader.GetString(8), Department = new Department { DepartmentName = reader.GetString(9) } }
                };

                return workerHours;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }
}
