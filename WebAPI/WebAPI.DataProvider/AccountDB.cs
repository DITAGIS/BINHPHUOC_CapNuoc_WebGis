using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using WebAPI.DataProvider.EF;

namespace WebAPI.DataProvider
{
    public class AccountDB
    {
        public SYS_Account IsValid(SYS_Account account)
        {
            try
            {
                using (var context = new BinhPhuocAccountEntities())
                {
                    var sysAccount = context.SYS_Account.FirstOrDefault(f => f.Username.Equals(account.Username,StringComparison.OrdinalIgnoreCase) && f.Password.Equals(account.Password));
                    return sysAccount;
                }
            }
            catch (Exception e)
            {
                throw e;
            }
        }
    }
}
