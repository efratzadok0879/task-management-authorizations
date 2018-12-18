using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Configuration;

namespace BOL
{
    public class Customer
    {
        [Key]
        public int CustomerId { get; set; }

        [Required(ErrorMessage = "Required field")]
        [StringValidator(MaxLength = 15, MinLength = 2)]
        [RegularExpression(@"[A-Za-z]+", ErrorMessage = "Customer name can contain only letters")]
        public string CustomerName { get; set; }

        //Navigation Properties

        public List<Project> OrderedProjects { get; set; }
    }
}
