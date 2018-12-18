using BOL;
using DAL;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;

namespace BLL
{
    public class CustomerService
    {
        public static List<Customer> GetAllCustomers()
        {
            try
            {
                string query = "SELECT * FROM task_management.customer ORDER BY customer_name;";
                Func<MySqlDataReader, List<Customer>> func = (reader) =>
                {
                    List<Customer> customers = new List<Customer>();
                    while (reader.Read())
                    {
                        customers.Add(BaseService.InitCustomer(reader));
                    }
                    return customers;
                };

                List<Customer> customerList = DBAccess.RunReader(query, func);
                return customerList;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
