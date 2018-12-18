using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BOL
{
    public class DepartmentHours
    {
        [Key]
        public int DepartmentHoursId { get; set; }

        [ForeignKey("Project")]
        public int ProjectId { get; set; }

        [ForeignKey("Department")]
        public int DepartmentId { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "'NumHours' must be above 0")]
        public int NumHours { get; set; }

        //Navigation Properties

        public Project Project { get; set; }

        public Department Department { get; set; }

    }
}
