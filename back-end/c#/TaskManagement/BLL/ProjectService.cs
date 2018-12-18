using BOL;
using DAL;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Linq;

namespace BLL
{
    public static class ProjectService
    {
        public static bool AddProject(Project newProject)
        {
            try
            {
                string query = "START TRANSACTION;";
                query += $"INSERT INTO task_management.project(project_name,manager_id,customer_id,team_leader_id,total_hours,start_date,end_date) VALUES('{newProject.ProjectName}',{newProject.ManagerId},{newProject.CustomerId},{newProject.TeamLeaderId},{newProject.TotalHours},{BaseService.FormatDate(newProject.StartDate)},{BaseService.FormatDate(newProject.EndDate)});";
                //take id of the inserted project
                query += "SELECT @@IDENTITY INTO @project_id;";
                //add the divided hours for each department
                foreach (DepartmentHours departmentHour in newProject.DepartmentsHours)
                {
                    query += $"INSERT INTO task_management.department_hours(project_id,department_id,num_hours) VALUES(@project_id,{departmentHour.DepartmentId},{departmentHour.NumHours});";
                }
                //add permission and worker-hours with default value-0 to extra workers if exists
                if (newProject.Permissions != null)
                    foreach (Permission permission in newProject.Permissions)
                    {
                        query += $"INSERT INTO task_management.permission(worker_id,project_id) VALUES({permission.WorkerId},@project_id);";
                        query += $"INSERT INTO task_management.worker_hours(project_id,worker_id,is_complete) VALUES (@project_id,{permission.WorkerId},1);";


                    }
                //add worker-hours with default value-0 to all team workers 
                List<User> teamWorkers = UserService.GetAllTeamUsers(newProject.TeamLeaderId);
                teamWorkers.ForEach(worker =>
                {
                    query += $"INSERT INTO task_management.worker_hours(project_id,worker_id,is_complete) VALUES (@project_id,{worker.UserId},1);";
                });
                query += "COMMIT;";
                int? x = DBAccess.RunNonQuery(query);
                return x >= 4;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static Project GetProjectById(int projectId)
        {
            try
            {
                string query = $"{GetProjectsQuery()} WHERE project_id={projectId}";
                Func<MySqlDataReader, Project> InitProject = (reader) =>
                {
                    Project project = null;
                    if (reader.Read())
                    {
                        project = BaseService.InitProject(reader);
                    }
                    return project;
                };

                Project foundProject = DBAccess.RunReader(query, InitProject);
                return foundProject;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static List<Project> GetAllProjects()
        {
            try
            {
                string query = $"{GetAllProjectsQuery()};";
                try
                {
                    List<Project> projectsList = GetAllProjects(query);
                    return projectsList;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static List<Project> GetProjectsByTeamLeaderId(int teamLeaderId)
        {
            try
            {
                string query = $"{GetProjectsQuery()} WHERE p.team_leader_id={teamLeaderId} ORDER BY project_name";
                List<Project> projectList = GetProjects(query);
                return projectList;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static List<Project> GetProjectsReports()
        {
            string query = $"{GetProjectsQuery()} ORDER BY project_name;";
            List<Project> projectList = GetProjects(query);
            return projectList;
        }

        public static bool HasProjects(int teamLeaderId)
        {
            try
            {
                string query = $"SELECT COUNT(*) FROM task_management.project WHERE team_leader_id={teamLeaderId};";
                int count = Convert.ToInt32(DBAccess.RunScalar(query));
                return count > 0;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static List<Project> GetAllProjects(DateTime date)
        {
            try
            {
                string query = $"{GetAllProjectsQuery()} WHERE end_date={BaseService.FormatDate(date.AddDays(1))} AND is_complete=false;";
                try
                {
                    List<Project> projectsList = GetAllProjects(query);
                    return projectsList;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static List<Project> GetProjectsInWorkingByTeamLeaderId(int teamLeaderId)
        {
            try
            {
                string query = $"{GetProjectsQuery()} WHERE p.team_leader_id={teamLeaderId} AND end_date>={BaseService.FormatDate(DateTime.Today)} AND is_complete=0;";
                List<Project> projectList = GetProjects(query);
                return projectList;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static void UpdateProjectStatus(int projectId)
        {
            Project project = GetProjectById(projectId);
            List<WorkerHours> workerHoursList = WorkerHoursService.GetAllWorkerHoursPerProject(projectId);
            bool isComplete = workerHoursList.All(workerHours => workerHours.IsComplete);
            int projectNumHours = workerHoursList.Sum(workerHours => workerHours.NumHours);
            if (isComplete && projectNumHours >= project.TotalHours)
            {
                EditProject(project);
            }
        }

        private static bool EditProject(Project project)
        {
            try
            {
                string query = $"UPDATE task_management.project SET is_complete=1 WHERE project_id={project.ProjectId};";
                return DBAccess.RunNonQuery(query) == 1;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static void AddDetailsToProject(Project project)
        {
            project.DepartmentsHours = DepartmentHoursService.GetDepartmentsHours(project.ProjectId);
            project.DepartmentsHours.ForEach(departmentHours =>
            {
                departmentHours.Department.Workers = UserService.GetAllUsers(departmentHours.DepartmentId, project.ProjectId);
                departmentHours.Department.Workers.ForEach(worker =>
                {
                    worker.WorkerHours = WorkerHoursService.GetWorkerHoursPerProject(worker.UserId, project.ProjectId);
                    worker.PresenceHours = PresenceHoursService.GetPresenceHours(worker.UserId, project.ProjectId);

                });
            });
        }

        private static string GetAllProjectsQuery()
        {
            string query = "SELECT * FROM task_management.project";
            return query;
        }

        private static string GetProjectsQuery()
        {
            string query =
                "SELECT " +
                "p.project_id,project_name,p.manager_id,p.customer_id," +
                "p.team_leader_id,total_hours,start_date,end_date,is_complete," +
                "customer_name,user_name,email " +
                "FROM task_management.project p " +
                "JOIN task_management.customer c " +
                "ON p.customer_id = c.customer_id " +
                "JOIN task_management.user u " +
                "ON p.team_leader_id = u.user_id";
            return query;
        }

        private static List<Project> GetAllProjects(string query)
        {
            try
            {
                try
                {
                    Func<MySqlDataReader, List<Project>> func = (reader) =>
                    {
                        List<Project> projects = new List<Project>();
                        while (reader.Read())
                        {
                            projects.Add(BaseService.InitProject(reader));
                        }
                        return projects;
                    };

                    List<Project> projectsList = DBAccess.RunReader(query, func);

                    return projectsList;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        private static List<Project> GetProjects(string query)
        {
            try
            {
                Func<MySqlDataReader, List<Project>> func = (reader) =>
                {

                    List<Project> projects = new List<Project>();
                    while (reader.Read())
                    {
                        Project project = BaseService.InitProject(reader);
                        projects.Add(project);
                    }
                    return projects;
                };

                List<Project> projectsList = DBAccess.RunReader(query, func);

                //foreach statment after DataReader associated with Connection closed first
                projectsList.ForEach(project =>
                {
                    AddDetailsToProject(project);

                });
                return projectsList;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }



    }
}
