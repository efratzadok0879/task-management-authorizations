using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOL
{
    public class ChangePassword
    {
        public int UserId { get; set; }
        public string Token { get; set; }
        public DateTime SendingDate { get; set; }
        public int AttempNum { get; set; }
    }
}
