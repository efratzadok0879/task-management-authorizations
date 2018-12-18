using System.ComponentModel.DataAnnotations;

namespace BOL.Help
{
    public class Login
    {

        [Required(ErrorMessage = "Required field")]
        [EmailAddress (ErrorMessage = "Email is not valid")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Required field")]
        //[MinLength(64, ErrorMessage = "Password is not valid")]
        [MaxLength(64, ErrorMessage = "Password is not valid")]
        [RegularExpression(@"[A-Za-z0-9]+", ErrorMessage = "Password can contain only letters and numbers")]
        [DataType(DataType.Password)]
        public string Password { get; set; }
    }
}
