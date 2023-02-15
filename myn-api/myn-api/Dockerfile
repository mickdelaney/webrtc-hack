FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["myn-api/myn-api.csproj", "myn-api/"]
RUN dotnet restore "myn-api/myn-api.csproj"
COPY . .
WORKDIR "/src/myn-api"
RUN dotnet build "myn-api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "myn-api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "myn-api.dll"]
