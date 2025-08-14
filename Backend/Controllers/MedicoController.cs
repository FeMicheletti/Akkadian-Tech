using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ClinicaAPI.Data;
using System.Security.Claims;

namespace ClinicaAPI.Controllers {
    [ApiController]
    [Route("[controller]")]
    public class MedicoController : ControllerBase {
        private readonly AppDbContext _db;

        public MedicoController(AppDbContext db) { _db = db; }

        //* GET /medico/agendamentos
        [Authorize(Roles = "Medico")]
        [HttpGet("agendamentos")]
        public IActionResult GetAll([FromQuery] string? data = null) {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrWhiteSpace(userIdClaim)) return BadRequest(new { error = "JWT sem Usuário" });

            var userId = int.Parse(userIdClaim);
            var allScheduling = _db.Schedulings.Where(u => u.DoctorId == userId).ToList();
            Console.WriteLine(allScheduling);

            return Ok(new { usuarioId = userId, agendamentos = allScheduling });
        }
    }
}