# 🏥 ClinicaApp
## 📌 Introdução
Este projeto foi desenvolvido como parte de um desafio técnico Full Stack, utilizando .NET 8 (ASP.NET Core) no backend, React + Next.js no frontend e PostgreSQL como banco de dados.
O objetivo é fornecer um sistema de agendamento médico com triagem automatizada de sintomas via IA (mock de palavras-chave).

---

## 🚀 Tecnologias Utilizadas

- **Backend:** ASP.NET Core 8 + Entity Framework Core
- **Frontend:** React + Next.js
- **Banco de Dados:** PostgreSQL
- **Autenticação:** JWT (JSON Web Token)
- **Infra:** Docker + Docker Compose

---

## ⚙️ Como Rodar o Projeto
### Pré-requisitos
- Docker e Docker Compose instalados.

### Passos
1. Clone este repositório.
2. Na raiz do projeto, rode:
    ```docker-compose up --build```
3. O sistema será inicializado com:
- **Backend (.NET API)** → http://localhost:5000
- **Frontend (Next.js)** → http://localhost:3000
- **Banco (PostgreSQL)** → localhost:5432

⚡ As **migrations** são aplicadas automaticamente na inicialização do container.

---

## 🔑 Autenticação

- O sistema utiliza JWT para proteger as rotas de agendamento.
- Existem dois perfis de usuário:
    - Paciente → pode criar e visualizar seus agendamentos.
    - Médico → pode visualizar agendamentos do dia, filtrados por data.

---

## 📅 Funcionalidades

### Paciente
- Registro e login.
- Criar agendamentos informando:
    - Data e hora
    - Sintomas
- Visualizar seus próprios agendamentos.

### Médico
- Login e acesso restrito por role.
- Visualizar agendamentos filtrados por data.

### Triagem (Mock de IA)
- A triagem automática utiliza palavras-chave nos sintomas para recomendar uma especialidade médica.
- Exemplo:
| Descrição do Agendamento | Descrição do Médico                                   |
| ------------------------ | ----------------------------------------------------- |
| Dor de Cabeça            | Clinico Geral (Atendo Dor de Cabeça)                  |
| Dor no peito             | Cardiologista (Atendo desde Dor no peito até Coração) | 

### 🔗 Endpoints Principais

| Método | Rota                         | Descrição                                 |
|--------|------------------------------|-------------------------------------------|
| POST   | `/auth/register`             | Registro de usuário                       |
| POST   | `/auth/login`                | Login e retorno do token JWT              |
| GET    | `/auth/validation`           | Valida o JWT enviado no authetication     |
| POST   | `/paciente/agendamentos`     | Criar novo agendamento (com triagem)      |
| GET    | `/paciente/agendamentos`     | Listar agendamentos do paciente           |
| GET    | `/medico/agendamentos?data=` | Listar agendamentos do médico por data    |
| POST   | `/mock/triagem`              | Simulação de IA de triagem (mock local)   |

---

### 🎨 Frontend
- Login e cadastro diferenciando paciente e médico.
- Interface do paciente para criar e visualizar agendamentos.
- Interface do médico para visualizar agendamentos do dia.
- Uso de LocalStorage para armazenar token JWT (em vez de Context/Redux por falta de tempo).

---

# 🔮 Melhorias Futuras
Se tivesse mais tempo, eu implementaria:
- CI/CD (pipeline automatizado).
- Mais telas e funcionalidades no frontend.
- Melhoria de arquitetura no backend (ex.: CQRS, MediatR).
- Testes integrados e unitários.
- Integração com IA real (OpenAI/Azure OpenAI).
- Melhoria no design (UI/UX).