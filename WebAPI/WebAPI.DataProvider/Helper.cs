using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebAPI.DataProvider
{
    public class Helper
    {
        public static string Query(string query)
        {
            var q = query.Replace("\r\n", "");
            q = q.Replace("\t", "");
            return q;
        }
    }
}
