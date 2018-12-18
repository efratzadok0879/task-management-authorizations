using BOL;
using DAL;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;

namespace BLL
{
    public static class DepartmentHoursService
    {
        public static List<DepartmentHours> GetDepartmentsHours(int projectId)
        {
            string query =
                    "SELECT department_hours_id,project_id,dh.department_id,num_hours,department_name " +
                    "FROM task_management.department_hours dh " +
                    "JOIN task_management.department d " +
                    "ON dh.department_id = d.department_id " +
                    $"where project_id = {projectId}";
            Func<MySqlDataReader, List<DepartmentHours>> func = (reader) =>
            {
                List<DepartmentHours> DepartmentsHours = new List<DepartmentHours>();
                while (reader.Read())
                {
                    DepartmentHours departmentHours = BaseService.InitDepartmentHours(reader);
                    DepartmentsHours.Add(departmentHours);

                }
                return DepartmentsHours;
            };
            List<DepartmentHours> DepartmentHoursList = DBAccess.RunReader(query, func);
            return DepartmentHoursList;
        }
    }
}
