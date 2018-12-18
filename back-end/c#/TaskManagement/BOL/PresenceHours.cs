using BOL.Help.Validators;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BOL
{
    public class PresenceHours
    {
        [Key]
        public int PresenceHoursId { get; set; }

        [ForeignKey("Worker")]
        public int WorkerId { get; set; }

        [ForeignKey("Project")]
        public int ProjectId { get; set; }

        [Required(ErrorMessage = "Required field")]
        [Column(TypeName = "Date")]
        [Today]
        public DateTime StartHour { get; set; }

        [Column(TypeName = "Date")]
        [Today]
        public DateTime? EndHour { get; set; }

        //Navigation Properties

        public User Worker { get; set; }

        public Project Project { get; set; }

    }
}
