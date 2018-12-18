using MySql.Data.MySqlClient;
using System;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text.RegularExpressions;

namespace BOL.Help.Validators
{
    public class UniqueAttribute : ValidationAttribute
    {
        public string GetDBSyntax(string fieldName)
        {
            string replaced = Regex.Replace(fieldName, @"(?<!_)([A-Z])", "_$1");
            replaced = replaced.ToLower();
            replaced = replaced.Substring(1);
            return replaced;
        }
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {

            ValidationResult validationResult = ValidationResult.Success;
            try
            {
                if (value == null)
                    return validationResult;
                string fieldName = GetDBSyntax(validationContext.DisplayName);

                //Invoke method 'RunObjectReader' from 'DBAccess' in 'DAL project' by reflection (not by adding reference!)

                //1. Load 'DAL' project
                string path = AppDomain.CurrentDomain.BaseDirectory;
                path=path.Substring(0, path.LastIndexOf('\\'));
                path = path.Substring(0, path.LastIndexOf('\\'))+ "\\DAL\\bin\\Debug\\DAL.dll";
                Assembly assembly = Assembly.LoadFrom(path);

                //2. Get 'DBAccess' type
                Type DBAccessType = assembly.GetTypes().First(t => t.Name.Equals("DBAccess"));

                //3. Get 'RunObjectReader' method
                MethodInfo RunObjectReaderMethod = DBAccessType.GetMethods().First(m => m.Name.Equals("RunReader"));

                //4. Invoke this method
                string tableName = GetDBSyntax(validationContext.ObjectInstance.GetType().Name);
                string query = $"SELECT * FROM task_management.{tableName} WHERE {fieldName} = '{value.ToString()}'";
                //todo check if it right
                if (tableName == "User")
                    query += "AND is_active=1";
                query += ";";
                Func<MySqlDataReader, bool> func = (reader) =>
                {
                    if (reader.Read() == false)
                        return true;
                    else
                    {
                        int id = reader.GetInt32(0);
                        int objectId = Convert.ToInt32(validationContext.ObjectInstance.GetType().GetProperties()[0].GetValue(validationContext.ObjectInstance));
                        if (id == objectId)
                            return true;
                        return false;
                    }
                };
                MethodInfo generic = RunObjectReaderMethod.MakeGenericMethod(typeof(bool));
                bool isUnique = (bool)generic.Invoke(null, new object[] { query, func });

                if (isUnique == false)
                {
                    ErrorMessage = $"{validationContext.DisplayName} must be unique";
                    validationResult = new ValidationResult(ErrorMessageString);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return validationResult;
        }

    }
}

