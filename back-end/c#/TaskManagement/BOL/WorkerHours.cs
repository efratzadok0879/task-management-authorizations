using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BOL
{
    public class WorkerHours
    {
        [Key]
        public int WorkerHoursId { get; set; }
        //todo- projectid add workerid together must be unique

        [ForeignKey("Project")]
        public int ProjectId { get; set; }

        //worker with department
        [ForeignKey("Worker")]
        public int WorkerId { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "'NumHours' must be above 0")]
        public int NumHours { get; set; }
        public bool IsComplete { get; set; }

        //Navigation Properties

        public Project Project { get; set; }

        public User Worker { get; set; }

    }
}
