using BOL;
using DAL;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;

namespace BLL
{
    public static class WorkerHoursService
    {
        public static List<WorkerHours> GetAllWorkerHours(int workerId)
        {
            string query;
            query = $"{GetWorkerHoursQuery()} WHERE worker_id ={workerId} AND w.is_complete=0;";
            List<WorkerHours> workerHoursList = GetWorkersHours(query);
            return workerHoursList;
        }

        public static bool EditWorkerHours(WorkerHours workerHours)
        {
            try
            {
                decimal presenceHoursSum = Convert.ToDecimal(PresenceHoursService.GetPresenceHoursSum(workerHours.ProjectId, workerHours.WorkerId));
                if (presenceHoursSum >= workerHours.NumHours)
                    workerHours.IsComplete = true;
                else
                    workerHours.IsComplete = false;
                string query = "UPDATE task_management.worker_hours " +
                    $"SET num_hours={workerHours.NumHours},is_complete={workerHours.IsComplete} " +
                    $"WHERE worker_hours_id={workerHours.WorkerHoursId};";

                ProjectService.UpdateProjectStatus(workerHours.ProjectId);
                return DBAccess.RunNonQuery(query) == 1;

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static bool HasUncomletedHours(int workerId, List<int> projectIdList)
        {
            string query;
            query =
                $"SELECT COUNT(*) FROM task_management.worker_hours WHERE worker_id ={workerId} " +
                "AND is_complete=0";
            if (projectIdList != null)
            {
                query += " AND project_id IN(";
                projectIdList.ForEach(projectId =>
                {
                    query += $"{projectId},";
                });
                query = query.Substring(0, query.Length - 1);
                query += ");";
            }
            else
                query += ";";

            int count = Convert.ToInt32(DBAccess.RunScalar(query));
            return count > 0;
        }

        public static List<WorkerHours> GetAllWorkerHoursPerProject(int projectId)
        {
            string query = $"{GetWorkerHoursQuery()} WHERE w.project_id ={projectId};";
            List<WorkerHours> workerHoursList = GetWorkersHours(query);
            return workerHoursList;
        }

        public static List<WorkerHours> GetUncompletedWorkersHours(int projectId)
        {
            string query = $"{GetWorkerHoursQuery()} WHERE w.is_complete=false AND w.project_id ={projectId};";
            List<WorkerHours> workerHoursList = GetWorkersHours(query);
            return workerHoursList;
        }

        public static List<WorkerHours> GetWorkerHoursPerProject(int workerId, int projectId)
        {
            string query;
            query = $"{GetWorkerHoursQuery()} WHERE worker_id ={workerId} AND w.project_id={projectId};";
            List<WorkerHours> workerHoursList = GetWorkersHours(query);
            return workerHoursList;
        }

        public static bool AddWorkerHours(WorkerHours workerHours)
        {
            try
            {
                string query = "INSERT INTO task_management.worker_hours(project_id,worker_id,num_hours,is_complete) " +
                    $"VALUES ({workerHours.ProjectId},{workerHours.WorkerId},{workerHours.NumHours},1);";
                return DBAccess.RunNonQuery(query) == 1;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static void AddWorkerHoursToTeamProjects(User user)
        {
            if (user.TeamLeaderId != null)
            {
                List<Project> projects = ProjectService.GetProjectsInWorkingByTeamLeaderId((int)user.TeamLeaderId);
                projects.ForEach(project =>
                {
                    List<WorkerHours> workerHoursList = GetWorkerHoursPerProject(user.UserId, project.ProjectId);
                    if (workerHoursList.Count == 0)
                    {
                        WorkerHours workerHours = new WorkerHours { ProjectId = project.ProjectId, WorkerId = user.UserId };
                        AddWorkerHours(workerHours);
                    }
                });
            }
        }

        private static string GetWorkerHoursQuery()
        {
            string query = $"SELECT w.*,project_name,user_name,email,department_name " +
                $"FROM task_management.worker_hours w " +
                $"JOIN task_management.project p ON w.project_id=p.project_id " +
                $"JOIN task_management.user u ON w.worker_id=u.user_id " +
                $"JOIN task_management.department d ON u.department_id=d.department_id";
            return query;
        }

        private static List<WorkerHours> GetWorkersHours(string query)
        {
            try
            {
                Func<MySqlDataReader, List<WorkerHours>> InitWorkerHoursList = (reader) =>
                {
                    List<WorkerHours> workersHours = new List<WorkerHours>();
                    while (reader.Read())
                    {
                        WorkerHours workerHours = BaseService.InitWorkerHours(reader);
                        workersHours.Add(workerHours);
                    }
                    return workersHours;
                };

                List<WorkerHours> workerHoursList = DBAccess.RunReader(query, InitWorkerHoursList);

                return workerHoursList;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }
}
