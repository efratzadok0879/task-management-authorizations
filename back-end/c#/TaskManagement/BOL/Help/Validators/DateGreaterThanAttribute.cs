using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOL.Help.Validators
{
    class DateGreaterThanAttribute : ValidationAttribute
    {
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            int id = (validationContext.ObjectInstance as Project).ProjectId;
            string valueFieldName = validationContext.DisplayName;
            DateTime laterDate = (DateTime)value;
            DateTime earlierDate;
            string validationMessage;

            if (valueFieldName.Equals("StartDate"))
            {
                earlierDate = DateTime.Today;
                if (id > 0 || laterDate.Date >= earlierDate)
                {
                    return ValidationResult.Success;
                }
                validationMessage = "'start date' must be greater than today";
            }
            else//valueFieldName.Equals("EndDate")
            {
                earlierDate = (validationContext.ObjectInstance as Project).StartDate;
                if (laterDate.Date >= earlierDate.Date)
                {
                    return ValidationResult.Success;
                }
                validationMessage = "'end date' must be greater than 'start date'";

            }

            return new ValidationResult(validationMessage);

        }
    }
}
