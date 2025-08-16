using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ClinicaAPI.Data;
using System.Security.Claims;
using ClinicaAPI.Models;

namespace ClinicaAPI.Controllers {
    [ApiController]
    [Route("[controller]")]
    public class MockController : ControllerBase {
        private readonly AppDbContext _db;

        public MockController(AppDbContext db) { _db = db; }

        //* POST /mock/triagem
        [HttpPost("triagem")]
        public IActionResult Triagem([FromQuery] int?id) {
            var scheduling = _db.Schedulings.FirstOrDefault(s => s.Id == id);
            if (scheduling == null || string.IsNullOrWhiteSpace(scheduling.Description)) return BadRequest(new { error = "Agendamento inválido ou sem descrição." });

            var medicos = _db.Users.Where(u => u.Role == "Medico").ToList();
            if (!medicos.Any()) return BadRequest(new { error = "Nenhum médico disponível." });

            User? melhorMedico = null;
            int melhorScore = -1;

            foreach (var medico in medicos) {
                if (string.IsNullOrWhiteSpace(medico.Description)) continue;

                int score = 0;

                foreach (var palavra in medico.Description.Split(' ', StringSplitOptions.RemoveEmptyEntries)) {
                    if (scheduling.Description.Contains(palavra, StringComparison.OrdinalIgnoreCase))
                        score++;
                }

                if (score > melhorScore) {
                    melhorScore = score;
                    melhorMedico = medico;
                }
            }

            if (melhorMedico == null) return Ok(new { message = "Nenhum médico compatível encontrado." });

            scheduling.DoctorId = melhorMedico.Id;
            _db.SaveChanges();

            return Ok(new { scheduling.Id });
        }
    }
}