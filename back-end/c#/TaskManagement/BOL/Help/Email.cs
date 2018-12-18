using System.Collections.Generic;
using System.Configuration;

namespace BOL.Help
{
    public class Email
    {
        public string Subject { get; set; }
        public string Body { get; set; }
        public List<string> ToAddress { get; set; }
        public string CompanyName { get; set; }
        public string CompanyPassword { get; set; }
        public Email()
        {
            ToAddress = new List<string>();
            CompanyName = ConfigurationManager.AppSettings["companyName"];
            CompanyPassword = ConfigurationManager.AppSettings["companyPassword"];

        }
   
    }
}
