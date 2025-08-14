using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ClinicaAPI.Data;
using System.Security.Claims;

namespace ClinicaAPI.Controllers {
    [ApiController]
    [Route("[controller]")]
    public class MockController : ControllerBase {
        private readonly AppDbContext _db;

        public MockController(AppDbContext db) { _db = db; }

        //* POST /mock/triagem
        [HttpPost("triagem")]
        public IActionResult Triagem() {
            //TODO: Integração com IA que vai verificar a descrição do agendamento e definir o melhor medico
            return Ok(new { status = "Ok" });
        }
    }
}