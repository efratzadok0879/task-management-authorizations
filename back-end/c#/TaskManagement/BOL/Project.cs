using BOL.Help.Validators;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Configuration;

namespace BOL
{
    public class Project
    {
        [Key]
        public int ProjectId { get; set; }

        [Required(ErrorMessage = "Required field")]
        [Unique]
        [StringValidator(MaxLength = 15, MinLength = 2)]
        [RegularExpression(@"[A-Za-z0-9]+", ErrorMessage = "Project name can contain only letters")]
        public string ProjectName { get; set; }

        [ForeignKey("Manager")]
        public int ManagerId { get; set; }

        [ForeignKey("Customer")]
        public int CustomerId { get; set; }

        [ForeignKey("TeamLeader")]
        public int TeamLeaderId { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "TotalHours must be above 0")]
        public int TotalHours { get; set; }

        [Required(ErrorMessage = "Required field")]
        [Column(TypeName = "Date")]
        [DateGreaterThan]
        public DateTime StartDate { get; set; }

        [Required(ErrorMessage = "Required field")]
        [Column(TypeName = "Date")]
        [DateGreaterThan]
        public DateTime EndDate { get; set; }

        public bool IsComplete { get; set; }

        //Navigation Properties

        public User Manager { get; set; }

        public Customer Customer { get; set; }

        public User TeamLeader { get; set; }

        [ContainsThreeDepartments]
        public List<DepartmentHours> DepartmentsHours { get; set; }

        public List<WorkerHours> WorkersHours { get; set; }

        public List<PresenceHours> PresenceHours { get; set; }

        public List<Permission> Permissions { get; set; }

    }
}
