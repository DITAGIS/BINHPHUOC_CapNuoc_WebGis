using System;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Web.Http;
using WebAPI.DataProvider;
using WebAPI.DataProvider.EF;
using WebAPI.Models;


namespace WebAPI.Controllers
{
    public class LoginController : ApiController
    {
        private AccountDB provider = new AccountDB();

        [HttpPost]
        public HttpResponseMessage Authenticate([FromBody] LoginRequest login)
        {
            var loginResponse = new LoginResponse { };
            SYS_Account loginRequest = new SYS_Account {
                Username = login.Username.ToLower(),
                Password = login.Password
            };

            bool isUsernamePasswordValid = false;       

            if(login != null)
            {
                try
                {
                    isUsernamePasswordValid = provider.IsValid(loginRequest) != null;
                }
                catch (Exception e)
                {
                    return Request.CreateErrorResponse(HttpStatusCode.BadRequest, e);
                }
            }
                
            // if credentials are valid
            if (isUsernamePasswordValid)
            {
                string token = CreateToken(loginRequest.Username);
                //return the token
                return Request.CreateResponse(HttpStatusCode.OK, token);
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.Unauthorized, "Tài khoản hoặc mật khẩu không đúng");
            }
        }

        private string CreateToken(string username)
        {
            //Set issued at date
            DateTime issuedAt = DateTime.UtcNow;
            //set the time when it expires
            DateTime expires = DateTime.UtcNow.AddDays(7);

            var tokenHandler = new JwtSecurityTokenHandler();
          
            //create a identity and add claims to the user which we want to log in
            ClaimsIdentity claimsIdentity = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.Name, username)                
            });

            const string sec = "401b09eab3c013d4ca54922bb802bec8fd5318192b0a75f201d8b3727429090fb337591abd3e44453b954555b7a0812e1081c39b740293f765eae731f5a65ed1";
            var now = DateTime.UtcNow;
            var securityKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(System.Text.Encoding.Default.GetBytes(sec));
            var signingCredentials = new Microsoft.IdentityModel.Tokens.SigningCredentials(securityKey,Microsoft.IdentityModel.Tokens.SecurityAlgorithms.HmacSha256Signature);


            //create the jwt
            var token =
                (JwtSecurityToken)
                    tokenHandler.CreateJwtSecurityToken(issuer:"http://localhost:50191",audience:"http://localhost:50191",
                        subject: claimsIdentity, notBefore: issuedAt, expires: expires, signingCredentials: signingCredentials);
            var tokenString = tokenHandler.WriteToken(token);

            return tokenString;
        }
    }
}
