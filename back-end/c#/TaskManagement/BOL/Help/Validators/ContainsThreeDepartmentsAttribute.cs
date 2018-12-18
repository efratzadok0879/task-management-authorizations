using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOL.Help.Validators
{
    class ContainsThreeDepartmentsAttribute : ValidationAttribute
    {
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            List<DepartmentHours> departmentsHours = value as List<DepartmentHours>;
            string validationMessage;

            //contains three items
            bool containsThreeItems = departmentsHours != null && departmentsHours.Count == 3;
            if (containsThreeItems == false)
            {
                validationMessage = "'departmentsHours' has to contain three items";
                return new ValidationResult(validationMessage);
            }

            //contains different departments
            bool containsDifferentDepartments = 
                departmentsHours.Any(departmentHours => departmentHours.DepartmentId == 1) &&
                departmentsHours.Any(departmentHours => departmentHours.DepartmentId == 2) &&
                departmentsHours.Any(departmentHours => departmentHours.DepartmentId == 3);
            if (containsDifferentDepartments == false)
            {
                validationMessage = "'departmentsHours' has to contain different departments";
                return new ValidationResult(validationMessage);
            }

            //sum of 'NumHours' equals 'TotalHours'
            bool sumNumHoursIsTotalHours = 
                departmentsHours.Sum(departmentHours => departmentHours.NumHours) ==
                (validationContext.ObjectInstance as Project).TotalHours;

            if (sumNumHoursIsTotalHours == false)
            {
                validationMessage = "sum of 'departmentsHours' must equals to 'totalHours'";
                return new ValidationResult(validationMessage);
            }
            return ValidationResult.Success;

        }
    }
}
