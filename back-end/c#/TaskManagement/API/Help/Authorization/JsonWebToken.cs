using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net.Http;
using System.Security.Claims;
using BLL;
using BOL;
using Microsoft.IdentityModel.Tokens;


namespace API.Help.Authorization
{
    public static class JsonWebToken
    {
        private const string Secret = "db3OIsj+BXE9NZDy0t8W3TcNekrF+2d/1sFnWG4HnV8TZY30iTOdtVWJG8abWvB1GlOgJuQZdcF2Luqm/hccMw==";

        public static string CreateToken(string uniqueValue, int expireMinutes = 20)
        {
            var symmetricKey = Convert.FromBase64String(Secret);
            var tokenHandler = new JwtSecurityTokenHandler();

            var now = DateTime.Now.ToLocalTime();
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                        {
                        new Claim(ClaimTypes.Name, uniqueValue)
                    }),

                Expires = now.AddMinutes(Convert.ToInt32(expireMinutes)),

                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(symmetricKey), SecurityAlgorithms.HmacSha256Signature)
            };

            var stoken = tokenHandler.CreateToken(tokenDescriptor);
            var token = tokenHandler.WriteToken(stoken);
            return token;
        }

        public static string ReadToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            string uniqueValue = tokenHandler.ReadJwtToken(token).Claims.First().Value;
            return uniqueValue;
        }

        public static User GetUser(HttpRequestMessage request)
        {
            try
            {
                var headers = request.Headers.GetValues("token");
                string token = headers.First();
                string uniqueValue = JsonWebToken.ReadToken(token);
                string email = uniqueValue.Substring(64);
                User user = UserService.GetUserByEmail(email);
                return user;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}