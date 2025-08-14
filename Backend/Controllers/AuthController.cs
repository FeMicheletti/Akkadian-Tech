using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ClinicaAPI.Models;
using ClinicaAPI.Data;
using BCrypt.Net;

using System.Text;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;

namespace ClinicaAPI.Controllers {
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase {
        private readonly AppDbContext _db;

        public AuthController(AppDbContext db) { _db = db; }

        //* POST /auth/register
        [HttpPost("register")]
        public IActionResult Register([FromBody] User usuario) {
            if (string.IsNullOrWhiteSpace(usuario.Email) || string.IsNullOrWhiteSpace(usuario.Name) || string.IsNullOrWhiteSpace(usuario.Password) || usuario.Role == null) {
                return BadRequest(new { error = "Informação faltando, favor verificar." });
            }

            //* Validar se o email já existe
            if (_db.Users.Any(u => u.Email == usuario.Email)) return BadRequest("Email já cadastrado.");

            //* Criar hash da senha
            usuario.Password = BCrypt.Net.BCrypt.HashPassword(usuario.Password);

            _db.Users.Add(usuario);
            _db.SaveChanges();

            //* Não retornar a senha!
            usuario.Password = null;

            return CreatedAtAction(null, new { id = usuario.Id }, usuario);
        }

        //* POST /auth/login
        [HttpPost("login")]
        public IActionResult Login([FromBody] User usuario) {
            if (string.IsNullOrWhiteSpace(usuario.Email) || string.IsNullOrWhiteSpace(usuario.Password)) {
                return BadRequest(new { error = "Informação faltando, favor verificar." });
            }

            //* Validação de usuário
            var userDb = _db.Users.FirstOrDefault(u => u.Email == usuario.Email);
            if (userDb == null) return Unauthorized(new { error = "Usuário ou senha inválidos." });
            if (!BCrypt.Net.BCrypt.Verify(usuario.Password, userDb.Password)) return Unauthorized(new { error = "Usuário ou senha inválidos." });

            //* Geração do JWT
            var jwtKey = HttpContext.RequestServices.GetRequiredService<IConfiguration>()["Jwt:Key"] ?? throw new Exception("Chave JWT não configurada no appsettings.json");
            var keyBytes = Encoding.ASCII.GetBytes(jwtKey);

            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenDescriptor = new SecurityTokenDescriptor {
                Subject = new ClaimsIdentity([
                    new Claim(ClaimTypes.NameIdentifier, userDb.Id.ToString()),
                    new Claim(ClaimTypes.Role, userDb.Role ?? throw new Exception("Sem Role")),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                ]),
                Expires = DateTime.UtcNow.AddHours(2),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(keyBytes),
                    SecurityAlgorithms.HmacSha256Signature
                )
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            return Ok(new { token = tokenString, userId = userDb.Id, role = userDb.Role });
        }
    }
}