# Use the ASP.NET Core runtime image for the final stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

# Use the .NET SDK image to build the app
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy the project file and restore dependencies
COPY ["NavbharatAgroAPI.csproj", "./"]
RUN dotnet restore "./NavbharatAgroAPI.csproj"

# Copy the rest of the source code
COPY . .

# Build the project
RUN dotnet build "NavbharatAgroAPI.csproj" -c Release -o /app/build

# Publish the project
FROM build AS publish
RUN dotnet publish "NavbharatAgroAPI.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final stage/image
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "NavbharatAgroAPI.dll"]
