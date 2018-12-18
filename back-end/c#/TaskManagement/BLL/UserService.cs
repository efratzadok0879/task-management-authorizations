using BOL;
using BOL.Help;
using DAL;
using System;
using System.Collections.Generic;
using MySql.Data.MySqlClient;
using System.Threading.Tasks;
using System.Net.Http;
using System.Linq;

namespace BLL
{
    public static class UserService
    {
        public static User Login(string email, string password)
        {
            try
            {
                string query = $"{GetSimpleUsersQuery()} WHERE email = '{email}' AND password = '{password}' AND is_active=1;";
                Func<MySqlDataReader, User> func = (reader) =>
                {
                    User user = null;
                    if (reader.Read())
                    {
                        user = BaseService.InitUser(reader);
                        //user.Password = string.Empty;
                    }
                    return user;
                };
                return DBAccess.RunReader(query, func);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static List<User> GetAllManagerUsers(int managerId)
        {
            try
            {
                string query = $"{GetUsersQuery()} AND u.manager_id={managerId};";
                return GetAllUsers(query);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static List<User> GetAllTeamUsers(int teamLeaderId)
        {
            try
            {
                string query = $"{GetUsersQuery()} AND u.team_leader_id={teamLeaderId};";
                return GetAllUsers(query);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static List<User> GetAllTeamLeaders(int managerId)
        {
            try
            {
                string query = $"{GetUsersQuery()} AND u.team_leader_id IS NULL AND u.manager_id={managerId};";
                List<User> teamLeaders = GetUsers(query);
                return teamLeaders;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static User GetUserById(int userId)
        {
            try
            {
                string query = $"{GetUsersQuery()} AND u.user_id={userId};";
                Func<MySqlDataReader, User> InitUser = (reader) =>
                {
                    User user = null;
                    if (reader.Read())
                    {
                        user = BaseService.InitUser(reader);
                        user.Password = string.Empty;
                    }
                    return user;
                };

                User foundUser = DBAccess.RunReader(query, InitUser);
                if (foundUser != null)
                {
                    foundUser.Permissions = PermissionService.GetPermissions(foundUser.UserId);
                }
                return foundUser;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static User GetUserByEmail(string email)
        {
            try
            {
                string query = $"SELECT * FROM task_management.user WHERE email ='{email}';";
                Func<MySqlDataReader, User> InitUser = (reader) =>
                {
                    User user = null;
                    if (reader.Read())
                    {
                        user = BaseService.InitUser(reader);
                        user.Password = string.Empty;
                    }
                    return user;
                };

                User foundUser = DBAccess.RunReader(query, InitUser);
                return foundUser;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static bool AddUser(User user)
        {
            try
            {
                string query = "INSERT INTO task_management.user" +
                    "(user_name, email, password, profile_image_name, department_id, team_leader_id,manager_id) " +
                    $"VALUES('{user.UserName}', '{user.Email}', '{user.Password}', " +
                    $"{BaseService.GetStringValueOrNull(user.ProfileImageName)}, " +
                    $"{BaseService.GetIntValueOrNull(user.DepartmentId)}, " +
                    $"{BaseService.GetIntValueOrNull(user.TeamLeaderId)}, " +
                    $"{BaseService.GetIntValueOrNull(user.ManagerId)});" +
                    "SELECT @@IDENTITY;";
                object userId = DBAccess.RunScalar(query);
                bool created;
                if (userId != null)
                {
                    created = true;
                    user.UserId = Convert.ToInt32(userId);
                    //add worker hours to worker for projects in his team
                    WorkerHoursService.AddWorkerHoursToTeamProjects(user);
                }
                else
                {
                    created = false;
                }
                return created;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static bool EditUser(User user)
        {
            try
            {
                User oldUser = GetUserById(user.UserId);
                string query = "UPDATE task_management.user " +
                    $"SET user_name='{user.UserName}'," +
                    $"email='{user.Email}'," +
                    $"profile_image_name={BaseService.GetStringValueOrNull(user.ProfileImageName)}," +
                    $"department_id={BaseService.GetIntValueOrNull(user.DepartmentId)}," +
                    $"team_leader_id={BaseService.GetIntValueOrNull(user.TeamLeaderId)} " +
                    $"where user_id={user.UserId};";
                bool edited = DBAccess.RunNonQuery(query) == 1;
                if (edited)
                {
                    //manage worker hours to team-projects if the worker moves team
                    if (oldUser.TeamLeaderId != user.TeamLeaderId && user.TeamLeaderId != null)
                    {
                        PermissionService.DeleteUnnecessaryPermissions(user);
                        WorkerHoursService.AddWorkerHoursToTeamProjects(user);
                    }
                }
                return edited;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static bool DeleteUser(int userId)
        {
            try
            {
                string query = $"UPDATE task_management.user SET is_active=0 where user_id={userId} AND is_active=1;";
                bool deleted = DBAccess.RunNonQuery(query) == 1;
                if (deleted)
                {
                    PermissionService.GetPermissions(userId).ForEach(
                        permission =>
                        {
                            PermissionService.DeletePermission(permission.PermissionId);
                        });
                }
                return deleted;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static bool SendEmail(Email email, User user)
        {
            try
            {
                User manager = GetUserById((int)user.ManagerId);
                email.ToAddress.Add(manager.Email);
                email.Body += $"\nFrom {user.UserName}";
                return BaseService.SendEmail(email);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static bool HasWorkers(int teamLeaderId)
        {
            try
            {
                string query = $"SELECT COUNT(*) FROM task_management.user WHERE team_leader_id={teamLeaderId};";
                int count = Convert.ToInt32(DBAccess.RunScalar(query));
                return count > 0;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static bool ForgotPassword(string email)
        {
            User user = GetUserByEmail(email);
            if (user == null)
                return false;
            string myToken = GenerateRandomNo();

            bool created = AddChangePassword(user.UserId, myToken);
            if (created)
            {
                Email myEmail = new Email()
                {
                    Subject = "A verification code has been sent to you",
                    Body = $"Please enter the following verification code:{myToken}" +
                    $" The code is only valid for ten minutes.",
                };
                myEmail.ToAddress.Add(user.Email);
                BaseService.SendEmail(myEmail);
                return true;
            }
            return false;
        }

        public static bool ConfirmToken(ChangePassword changePassword)
        {
            try
            {

                string query = "SELECT COUNT(*) FROM task_management.change_password " +
                    $"WHERE user_id = {changePassword.UserId} AND token = '{changePassword.Token}' AND attemp_num<3;";
                int count = Convert.ToInt32(DBAccess.RunScalar(query));

                if (count > 0)
                {
                    return true;
                }
                query = "UPDATE task_management.change_password " +
                    $"SET attemp_num=attemp_num+1 WHERE user_id={changePassword.UserId};";
                DBAccess.RunNonQuery(query);
                return false;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static bool ChangePassword(User user)
        {
            try
            {
                string query = $"UPDATE task_management.user SET password='{user.Password}' where user_id={user.UserId};";
                bool edited = DBAccess.RunNonQuery(query) == 1;
                return edited;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static List<User> GetAllUsers(int departmentId, int projectId)
        {
            try
            {
                string query = $"{GetUsersQuery()} AND u.department_id={departmentId} AND u.user_id in " +
                    $"(SELECT worker_id FROM task_management.worker_hours WHERE project_id={projectId})";
                List<User> userList = GetAllUsers(query);
                return userList;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static async Task DeleteToken()
        {
            try
            {
                string query = $"delete from task_management.change_password where sending_date < DATE_SUB(NOW(), INTERVAL 10 MINUTE); ";
                DBAccess.RunNonQuery(query);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        private static string GenerateRandomNo()
        {
            Random random = new Random();
            return random.Next(0, 9999).ToString("D4");
        }

        private static bool AddChangePassword(int userId, string token)
        {
            try
            {
                string query = "INSERT INTO task_management.change_password(user_id, token, sending_date) " +
                    $"VALUES('{userId}', '{token}', {BaseService.FormatDate(DateTime.Now, "yyyy-MM-dd HH:mm:ss")});";
                bool created = DBAccess.RunNonQuery(query) == 1;
                return created;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        private static string GetSimpleUsersQuery()
        {
            string query = "SELECT * FROM task_management.user";
            return query;
        }

        private static string GetUsersQuery()
        {
            string query =
                "SELECT u.*,department_name,tl.user_name FROM task_management.user u " +
               "LEFT JOIN task_management.department d on u.department_id=d.department_id " +
               "LEFT JOIN task_management.user tl ON u.team_leader_id=tl.user_id " +
               "WHERE u.is_active=1";
            return query;
        }

        private static List<User> GetUsers(string query)
        {
            try
            {
                Func<MySqlDataReader, List<User>> InitUserList = (reader) =>
                {
                    List<User> users = new List<User>();
                    while (reader.Read())
                    {
                        User user = BaseService.InitUser(reader);
                        user.Password = string.Empty;
                        users.Add(user);
                    }
                    return users;
                };

                List<User> userList = DBAccess.RunReader(query, InitUserList);
                return userList;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        private static List<User> GetAllUsers(string query)
        {
            try
            {
                List<User> userList = GetUsers(query);

                //join permission of project for each user 
                userList.ForEach(user =>
                {
                    user.Permissions = PermissionService.GetPermissions(user.UserId);
                });
                return userList;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


    }
}
