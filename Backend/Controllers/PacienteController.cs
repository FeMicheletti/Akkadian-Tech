using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ClinicaAPI.Models;
using ClinicaAPI.Data;
using System.Security.Claims;

namespace ClinicaAPI.Controllers {
    [ApiController]
    [Route("[controller]")]
    public class PacienteController : ControllerBase {
        private readonly AppDbContext _db;

        public PacienteController(AppDbContext db) { _db = db; }

        //* GET /paciente/agendamentos
        [Authorize(Roles = "Paciente")]
        [HttpGet("agendamentos")]
        public IActionResult GetAll() {
            //* Recupera o UserId
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrWhiteSpace(userIdClaim)) return BadRequest(new { error = "JWT sem Usuário" });
            var userId = int.Parse(userIdClaim);

            //* Consulta do agendamento
            var allScheduling = _db.Schedulings.Where(u => u.UserId == userId).ToList();

            return Ok(new { agendamentos = allScheduling });
        }

        //* POST /paciente/agendamentos
        [Authorize(Roles = "Paciente")]
        [HttpPost("agendamentos")]
        public IActionResult PostAgendamento([FromBody] Scheduling scheduling) {
            //* Recupera o UserId
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrWhiteSpace(userIdClaim)) return BadRequest(new { error = "JWT sem Usuário" });
            scheduling.UserId = int.Parse(userIdClaim);

            //* Valida campo obrigatórios
            if (string.IsNullOrWhiteSpace(scheduling.Description)) return BadRequest(new { error = "Agendamento sem Descrição" });
            if (scheduling.Date == default || !scheduling.Date.HasValue) return BadRequest(new { error = "Agendamento sem Data" });

            //* Converte para UTC
            scheduling.Date = DateTime.SpecifyKind(scheduling.Date.Value, DateTimeKind.Utc);

            //* Salva no banco
            _db.Schedulings.Add(scheduling);
            _db.SaveChanges();

            return Ok(new { agendamento = scheduling });
        }
    }
}