// using ClinicaAPI.Services;
using ClinicaAPI.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

//* Conexão com o DB
builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

//* Configuração do JWT
var jwtKey = builder.Configuration["Jwt:Key"] ?? throw new Exception("Chave JWT não configurada no appsettings.json");
var keyBytes = Encoding.ASCII.GetBytes(jwtKey);

builder.Services.AddAuthentication(options => {
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options => {
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(keyBytes),
        ValidateIssuer = false,
        ValidateAudience = false
    };
});

//* Injetar serviços
// builder.Services.AddScoped<IUsuarioService, UsuarioService>();
// builder.Services.AddScoped<IAgendamentoService, AgendamentoService>();
// builder.Services.AddScoped<ITriagemService, TriagemService>();

//* Adicionar controllers
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();

var app = builder.Build();

using var scope = app.Services.CreateScope();
var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

try {
    db.Database.CanConnect(); // retorna true se a conexão funcionar
    Console.WriteLine("Conexão com o PostgreSQL OK!");
}
catch (Exception ex) {
    Console.WriteLine("Erro na conexão: " + ex.Message);
}


//* Middleware
if (app.Environment.IsDevelopment()) app.MapOpenApi();

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

//* Roteamento
app.MapControllers();

app.Run();