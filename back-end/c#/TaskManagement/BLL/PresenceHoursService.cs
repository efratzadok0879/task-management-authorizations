using BOL;
using BOL.Help;
using DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using MySql.Data.MySqlClient;

namespace BLL
{
    public static class PresenceHoursService
    {
        public static int AddPresenceHours(PresenceHours newPresenceHours)
        {
            try
            {
                newPresenceHours.StartHour = newPresenceHours.StartHour.ToLocalTime();
                string query = "INSERT INTO task_management.presence_hours(worker_id,project_id,start_hour) " +
                    $"VALUES({newPresenceHours.WorkerId}, {newPresenceHours.ProjectId}, " +
                    $"{BaseService.FormatDate(newPresenceHours.StartHour, "yyyy-MM-dd HH:mm:ss")});" +
                    "SELECT @@IDENTITY;";
                object presenceHoursId = DBAccess.RunScalar(query);
                if (presenceHoursId != null)
                {
                    int id = Convert.ToInt32(presenceHoursId);
                    return id;
                }
                return -1;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static bool EditPresenceHours(PresenceHours presenceHours)
        {
            try
            {
                string query = "UPDATE task_management.presence_hours " +
                    $"SET end_hour={BaseService.FormatDate(((DateTime)presenceHours.EndHour).ToLocalTime(), "yyyy-MM-dd HH:mm:ss")}" +
                    $" WHERE presence_hours_id={presenceHours.PresenceHoursId};";
                bool created = DBAccess.RunNonQuery(query) == 1;
                if (created)
                {
                    WorkerHours workerHours = WorkerHoursService.GetWorkerHoursPerProject(presenceHours.WorkerId, presenceHours.ProjectId)[0];
                    WorkerHoursService.EditWorkerHours(workerHours);
                }
                return created;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static List<PresenceStatus> GetPresenceStatusPerWorkers(int teamLeaderId)
        {
            string query =
                //create view that select presence status
                "CREATE VIEW task_management.presence_status " +
                "AS " +
                "SELECT user_name, pro.project_name,w.num_hours, IFNULL(SUM(TIMESTAMPDIFF(SECOND, start_hour, end_hour) / 3600), 0) AS presence " +
                "FROM task_management.user u " +
                "JOIN task_management.worker_hours w ON w.worker_id = u.user_id " +
                "JOIN task_management.project pro ON w.project_id = pro.project_id " +
                "LEFT JOIN task_management.presence_hours pre ON pre.project_id = pro.project_id AND pre.project_id = w.project_id AND pre.worker_id = u.user_id AND pre.worker_id = w.worker_id " +
                $"WHERE u.team_leader_id = {teamLeaderId} AND(MONTH(start_hour) is null or MONTH(start_hour) = MONTH(CURRENT_DATE())) GROUP BY user_name, pre.project_id; " +

                //select sum of all projects presence status per worker and details of every project
                "SELECT user_name,null as project_name,sum(num_hours) AS num_hours, sum(presence)  AS presence " +
                "FROM task_management.presence_status " +
                "GROUP BY user_name " +
                "UNION SELECT * FROM task_management.presence_status; " +
                "DROP VIEW task_management.presence_status";

            Func<MySqlDataReader, List<PresenceStatus>> InitPresenceStatusList = (reader) =>
            {
                List<PresenceStatus> presenceStatusList = new List<PresenceStatus>();
                while (reader.Read())
                {
                    var presenceStatus = new PresenceStatus { UserName = reader.GetString(0), ProjectName = reader.IsDBNull(1) ? null : reader.GetString(1), ProjectHours = reader.GetInt32(2), PresenceHours = reader.GetDecimal(3) };
                    presenceStatusList.Add(presenceStatus);
                }
                return presenceStatusList;
            };
            return DBAccess.RunReader(query, InitPresenceStatusList);
        }

        public static List<PresenceStatus> GetPresenceStatusPerProjects(int workerId)
        {
            string query =
          "SELECT pro.project_name,IFNULL(SUM(TIMESTAMPDIFF(SECOND, start_hour, end_hour) / 3600), 0) AS presence, num_hours " +
          "FROM task_management.worker_hours w " +
          "LEFT JOIN task_management.project pro " +
          "ON pro.project_id = w.project_id " +
          "LEFT JOIN task_management.presence_hours pre " +
          $"ON pro.project_id = pre.project_id AND pre.worker_id = {workerId} AND MONTH(start_hour) = MONTH(CURRENT_DATE()) " +
          $"WHERE w.worker_id = {workerId} " +
          "AND w.num_hours > 0 " +
          "GROUP BY pre.project_id;";
            Func<MySqlDataReader, List<PresenceStatus>> InitPresenceStatusList = (reader) =>
            {
                List<PresenceStatus> presenceStatusList = new List<PresenceStatus>();
                while (reader.Read())
                {
                    var presenceStatus = new PresenceStatus { ProjectName = reader.GetString(0), PresenceHours = reader.GetDecimal(1), ProjectHours = reader.GetInt32(2) };
                    presenceStatusList.Add(presenceStatus);
                }
                return presenceStatusList;
            };
            return DBAccess.RunReader(query, InitPresenceStatusList);
        }

        public static decimal GetPresenceHoursSum(int projectId, int workerId)
        {
            string query = "SELECT IFNULL(SUM(TIMESTAMPDIFF(SECOND, start_hour, end_hour)/3600),0) AS sum " +
                           "FROM task_management.presence_hours " +
                           $"WHERE project_id = {projectId} AND worker_id = {workerId}";
            decimal sum = Convert.ToDecimal(DBAccess.RunScalar(query));
            return sum;
        }

        public static List<PresenceHours> GetPresenceHours(int workerId, int projectId)
        {
            try
            {
                string query = "SELECT p.*,u.user_name FROM task_management.presence_hours p " +
                    "JOIN task_management.user u ON p.worker_id=u.user_id " +
                    $"WHERE end_hour IS NOT NULL AND worker_id={workerId} AND project_id={projectId};";

                Func<MySqlDataReader, List<PresenceHours>> InitPresenceHoursList = (reader) =>
                {
                    List<PresenceHours> presencesHours = new List<PresenceHours>();
                    while (reader.Read())
                    {
                        PresenceHours presenceHours = BaseService.initPresenceHours(reader);
                        presencesHours.Add(presenceHours);
                    }
                    return presencesHours;
                };

                List<PresenceHours> presenceHoursList = DBAccess.RunReader(query, InitPresenceHoursList);
                return presenceHoursList.Where(presenceHours => presenceHours.StartHour.Month == DateTime.Today.Month).ToList();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
  
    }
}
