using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace API.Help.Authorization
{
    [Flags]
    public enum eStatus
    {
        Nothing=1,
        Manager=2,
        TeamLeader=4,
        Worker=8
    }
}