using MySql.Data.MySqlClient;
using System;
using System.Configuration;

namespace DAL
{
    public static class DBAccess
    {
        static MySqlConnection Connection;
        static DBAccess()
        {
            string connectionString = ConfigurationManager.AppSettings["connectionString"];
            Connection = new MySqlConnection(connectionString);
        }

        public static int? RunNonQuery(string query)
        {
            lock (Connection)
            {
                try
                {
                    if (Connection.State != System.Data.ConnectionState.Open)
                    {
                        Connection.Open();
                    }
                    MySqlCommand command = new MySqlCommand(query, Connection);
                    return command.ExecuteNonQuery();
                }
                catch
                {
                    return null;
                }
                finally
                {
                    if (Connection.State != System.Data.ConnectionState.Closed)
                    {
                        Connection.Close();
                    }
                }
            }
        }

        public static object RunScalar(string query)
        {
            lock (Connection)
            {
                try
                {
                    if (Connection.State != System.Data.ConnectionState.Open)
                    {
                        Connection.Open();
                    }
                    MySqlCommand command = new MySqlCommand(query, Connection);
                    return command.ExecuteScalar();
                }
                catch (Exception)
                {
                    return null;
                }
                finally
                {
                    if (Connection.State != System.Data.ConnectionState.Closed)
                    {
                        Connection.Close();
                    }
                }
            }
        } 

        public static T RunReader<T>(string query, Func<MySqlDataReader, T> func)
        {
            lock (Connection)
            {
                try
                {
                    if (Connection.State != System.Data.ConnectionState.Open)
                    {
                        Connection.Open();
                    }
                    MySqlCommand command = new MySqlCommand(query, Connection);
                    MySqlDataReader reader = command.ExecuteReader();
                    return func(reader);
                }
                catch (Exception ex)
                {
                    throw ex;
                }
                finally
                {
                    if (Connection.State != System.Data.ConnectionState.Closed)
                    {
                        Connection.Close();
                    }
                }
            }
        }

    }
}
