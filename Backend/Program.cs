// using ClinicaAPI.Services;
using Azure;
using Azure.AI.OpenAI;
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

//* Adicionar controllers
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();

//* Permitindo o CORS
builder.Services.AddCors(options => {
    options.AddPolicy("AllowLocalhost", policy => {
        policy.WithOrigins(builder.Configuration["Front:Url"] ?? throw new Exception("URL do Front não configurado no appsettings.json")).AllowAnyHeader().AllowAnyMethod();
    });
});

var app = builder.Build();

using var scope = app.Services.CreateScope();
var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

try {
    db.Database.CanConnect(); // retorna true se a conexão funcionar
    Console.WriteLine("Conexão com o PostgreSQL OK!");
} catch (Exception ex) {
    Console.WriteLine("Erro na conexão: " + ex.Message);
}

//* Middleware
if (app.Environment.IsDevelopment()) app.MapOpenApi();

app.UseCors("AllowLocalhost");
app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

//* Roteamento
app.MapControllers();

app.Run();