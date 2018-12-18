using System;
using System.ComponentModel.DataAnnotations;

namespace BOL.Help.Validators
{
    class TodayAttribute : ValidationAttribute
    {
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {

            if (value==null||(((DateTime)value).Date==DateTime.Today))
                return ValidationResult.Success;
            string validationMessage = "date must be today";
            return new ValidationResult(validationMessage);
        }
    }
}