using BOL;
using DAL;
using System;
using System.Collections.Generic;
using MySql.Data.MySqlClient;

namespace BLL
{
    public static class PermissionService
    {
        public static int AddPermission(Permission permission)
        {
            try
            {
                string query;
                query = "INSERT INTO task_management.permission(worker_id,project_id) " +
                    $"VALUES({permission.WorkerId},{permission.ProjectId});" +
                    "SELECT @@IDENTITY;";
                int permissionId = Convert.ToInt32(DBAccess.RunScalar(query));
                List<WorkerHours> workerHoursList = WorkerHoursService.GetWorkerHoursPerProject(permission.WorkerId, permission.ProjectId);
                if (workerHoursList.Count == 0)
                {
                    WorkerHours workerHours = new WorkerHours { ProjectId = permission.ProjectId, WorkerId = permission.WorkerId };
                    WorkerHoursService.AddWorkerHours(workerHours);
                }
                return permissionId;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static bool DeletePermission(int permissionId)
        {
            try
            {
                string query = $"UPDATE task_management.permission SET is_active=0 WHERE permission_id={permissionId} AND is_active=1;";
                return DBAccess.RunNonQuery(query) == 1;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static List<Permission> GetPermissions(int userId)
        {
            string query = "SELECT per.*, u.user_name,pro.project_name FROM task_management.permission per " +
                "JOIN task_management.user u ON per.worker_id = u.user_id JOIN task_management.project pro ON per.project_id = pro.project_id " +
                $"WHERE per.is_active = 1 and per.worker_id = {userId};";
            return GetPermissions(query);
        }

        public static void DeleteUnnecessaryPermissions(User user)
        {

            List<Permission> workerPermissions = GetWorkerPermissionToTeamProjects(user);
            workerPermissions.ForEach(permission =>
            {
                DeletePermission(permission.PermissionId);
            });
        }

        public static List<Permission> GetWorkerPermissionToTeamProjects(User user)
        {
            string query =
                "SELECT * FROM task_management.permission " +
                $"WHERE worker_id = {user.UserId} AND project_id IN" +
                $"(SELECT project_id FROM task_management.project WHERE team_leader_id = {user.TeamLeaderId});";
            return GetPermissions(query);

        }

        private static List<Permission> GetPermissions(string query)
        {
            Func<MySqlDataReader, List<Permission>> InitPermissionList = (reader) =>
            {

                List<Permission> permissions = new List<Permission>();
                while (reader.Read())
                {
                    permissions.Add(BaseService.InitPermission(reader));
                }
                return permissions;

            };
            List<Permission> permissionList = DBAccess.RunReader(query, InitPermissionList);
            return permissionList;
        }

    }
}
