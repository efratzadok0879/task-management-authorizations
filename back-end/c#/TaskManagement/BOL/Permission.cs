using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BOL
{
    public class Permission
    {
        [Key]
        public int PermissionId { get; set; }

        [ForeignKey("Worker")]
        public int WorkerId { get; set; }

        [ForeignKey("Project")]
        public int ProjectId { get; set; }

        public bool IsActive { get; set; }

        //Navigation Properties

        public User Worker { get; set; }

        public Project Project { get; set; }
    }
}
