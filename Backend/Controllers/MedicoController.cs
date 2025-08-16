using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ClinicaAPI.Data;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace ClinicaAPI.Controllers {
    [ApiController]
    [Route("[controller]")]
    public class MedicoController : ControllerBase {
        private readonly AppDbContext _db;

        public MedicoController(AppDbContext db) { _db = db; }

        //* GET /medico/agendamentos
        [Authorize(Roles = "Medico")]
        [HttpGet("agendamentos")]
        public IActionResult GetAll([FromQuery] string? date = null) {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrWhiteSpace(userIdClaim)) return BadRequest(new { error = "JWT sem Usuário" });

            DateTime? filterDate = null;
            if (!string.IsNullOrWhiteSpace(date) && DateTime.TryParse(date, out var parsed)) filterDate = parsed.Date;

            var userId = int.Parse(userIdClaim);
            var query = from s in _db.Schedulings
                        join u in _db.Users on s.UserId equals u.Id into paciente
                        from p in paciente.DefaultIfEmpty()
                        join d in _db.Users on s.DoctorId equals d.Id into medico
                        from m in medico.DefaultIfEmpty()
                        where s.DoctorId == userId
                        select new {
                            s.Id,
                            s.Description,
                            s.Date,
                            UserId = p.Name,
                            DoctorId = m != null ? m.Name : null
                        };

            if (filterDate.HasValue) {
                var startUtc = DateTime.SpecifyKind(filterDate.Value.Date, DateTimeKind.Utc);
                var endUtc = startUtc.AddDays(1);

                query = query.Where(x => x.Date >= startUtc && x.Date < endUtc);
            }

            var allScheduling = query.OrderBy(x => x.Date).ToList();

            return Ok(new { agendamentos = allScheduling });
        }
    }
}