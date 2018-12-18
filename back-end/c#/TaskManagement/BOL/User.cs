using BOL.Help.Validators;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Configuration;

namespace BOL
{
    public class User
    {
        [Key]
        public int UserId { get; set; }

        [Required(ErrorMessage = "Required field")]
        [StringValidator(MaxLength = 15, MinLength = 2)]
        [RegularExpression(@"[A-Za-z0-9]+", ErrorMessage = "User name can contain only letters")]
        public string UserName { get; set; }

        [Required(ErrorMessage = "Required field")]
        [Unique]
        [EmailAddress(ErrorMessage = "Email is not valid")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Required field")]
        [Unique]
        [RegularExpression(@"[A-Za-z0-9]+", ErrorMessage = "Password can contain only letters and numbers")]
        [MinLength(64, ErrorMessage = "Password is not valid")]
        [MaxLength(64, ErrorMessage = "Password is not valid")]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        [Required(ErrorMessage = "Required field")]
        [DataType(DataType.Password)]
        [Compare("Password", ErrorMessage = "The password and confirmation password do not match")]
        [NotMapped]
        public string ConfirmPassword { get; set; }

        public string ProfileImageName { get; set; }

        [ForeignKey("Department")]
        public int? DepartmentId { get; set; }

        [ForeignKey("TeamLeader")]
        public int? TeamLeaderId { get; set; }

        [ForeignKey("Manager")]
        public int? ManagerId { get; set; }

        public bool IsActive { get; set; }

        //Navigation Properties

        public Department Department { get; set; }

        public User TeamLeader { get; set; }
        public User Manager { get; set; }

        public List<User> Workers { get; set; }

        public List<Project> ManagerProjects { get; set; }

        public List<Project> TeamLeaderProjects { get; set; }

        public List<WorkerHours> WorkerHours { get; set; }

        public List<PresenceHours> PresenceHours { get; set; }
        public List<Permission> Permissions { get; set; }

    }
}