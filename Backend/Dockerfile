FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY *.csproj ./
RUN dotnet restore

COPY . ./

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS final
WORKDIR /app

COPY --from=build /src ./

RUN dotnet tool install --global dotnet-ef
ENV PATH="$PATH:/root/.dotnet/tools"

ENTRYPOINT ["bash", "-c", "dotnet ef database update --project ./ClinicaAPI.csproj && dotnet run --project ./ClinicaAPI.csproj --urls http://0.0.0.0:5000"]