using BOL;
using DAL;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL
{
    public static class DepartmentService
    {
        public static List<Department> GetAllDepartments()
        {
            try
            {
                string query = "SELECT * FROM task_management.department;";
                Func<MySqlDataReader, List<Department>> func = (reader) =>
                {
                    List<Department> departments = new List<Department>();
                    while (reader.Read())
                    {
                        departments.Add(BaseService.InitDepartment(reader));
                    }
                    return departments;
                };

                List<Department> departmentList = DBAccess.RunReader(query, func);
                return departmentList;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
