using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ClinicaAPI.Data;
using System.ClientModel;
using Azure.AI.OpenAI;
using OpenAI.Chat;
using ClinicaAPI.Models;
using System.Text.Json;

namespace ClinicaAPI.Controllers {
    [ApiController]
    [Route("[controller]")]
    public class MockController : ControllerBase {
        private readonly AppDbContext _db;
        private readonly ChatClient _chatClient;

        public MockController(AppDbContext db, IConfiguration configuration) {
            _db = db;

            var endpoint = configuration["OpenAI:Endpoint"];
            var apiKey   = configuration["OpenAI:ApiKey"];
            var deployment = configuration["OpenAI:Deployment"];

            if (string.IsNullOrWhiteSpace(endpoint) || string.IsNullOrWhiteSpace(apiKey) || string.IsNullOrWhiteSpace(deployment)) {
                throw new InvalidOperationException("Config ausente: defina OpenAI:Endpoint, OpenAI:ApiKey e OpenAI:Deployment em appsettings/Secret.");
            }

            var azureClient = new AzureOpenAIClient(new Uri(endpoint), new ApiKeyCredential(apiKey));
            _chatClient = azureClient.GetChatClient(deployment);
        }

        //* POST /mock/triagem?id=123
        [HttpPost("triagem")]
        public async Task<IActionResult> Triagem([FromQuery] int? id) {
            if (id is null) return BadRequest(new { error = "Parâmetro 'id' é obrigatório." });

            var scheduling = _db.Schedulings.FirstOrDefault(s => s.Id == id);
            if (scheduling is null || string.IsNullOrWhiteSpace(scheduling.Description)) return BadRequest(new { error = "Agendamento inválido ou sem descrição." });

            //* 1) Monte a lista de especialidades (vindas do banco)
            var doctors = GetDoctors();
            if (!doctors.Any()) return BadRequest(new { error = "Não há médicos disponíveis para triagem." });

            //* 2) Prompt (peça APENAS a especialidade)
            var doctorsJson = JsonSerializer.Serialize(doctors);
            var prompt = $"Analise a descrição do paciente: \"{scheduling.Description}\".\n Escolha o médico mais adequado entre esta lista (responda EXATAMENTE com uma delas, sem justificativas):\n"+string.Join(", ", doctorsJson);

            //* 3) Chamada ao Azure OpenAI
            var messages = new List<ChatMessage> {
                new SystemChatMessage("Você é um assistente de triagem médica. Responda SOMENTE com o ID do melhor médico da lista fornecida, sem explicações."),
                new UserChatMessage(prompt)
            };

            var options = new ChatCompletionOptions {
                Temperature = 0.2f,
                MaxOutputTokenCount = 20
            };

            ChatCompletion completion;
            try {
                completion = await _chatClient.CompleteChatAsync(messages, options);
            } catch (Exception ex) {
                return StatusCode(500, new { error = $"Falha ao consultar Azure OpenAI: {ex.Message}" });
            }

            var resposta = (completion.Content.Count > 0 ? completion.Content[0].Text : string.Empty)?.Trim();
            if (string.IsNullOrWhiteSpace(resposta)) return Ok(new { message = "IA não retornou um médico." });

            //* 4) Verifica se o retorno é um número e se o médico existe
            if (!int.TryParse(resposta, out int medicoId)) return BadRequest(new { message = "O ID do médico retornado pela IA não é um número válido." });

            var medico = _db.Users.FirstOrDefault(u => u.Id == medicoId && u.Role == "Medico");
            if (medico == null) return StatusCode(505, new { message = "O ID do médico retornado pela IA não existe ou não pertence a um médico cadastrado." });

            //* 5) Associe o médico ao agendamento e salve
            scheduling.DoctorId = medicoId;
            _db.SaveChanges();

            return Ok(new {
                scheduling.Id,
                DoctorId = medicoId
            });
        }

        private IEnumerable<object> GetDoctors() {
            var allDoctors = _db.Users.Where(u => u.Role == "Medico").Select(u => new { Id = u.Id, Name = u.Name, Description = u.Description }).ToList();
            return allDoctors;
        }
    }
}
