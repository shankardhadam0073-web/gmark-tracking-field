# Use the ASP.NET Core runtime image for the final stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app

RUN apt-get update && \
    apt-get install -y libkrb5-3 && \
    rm -rf /var/lib/apt/lists/*

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENV DOTNET_hostBuilder__reloadConfigOnChange=false
ENV DOTNET_USE_POLLING_FILE_WATCHER=1

# Use the .NET SDK image to build the app
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy the project file and restore dependencies
COPY ["NavbharatAgroAPI.csproj", "./"]
RUN dotnet nuget locals all --clear
RUN dotnet restore "./NavbharatAgroAPI.csproj" --force

# Copy the rest of the source code
COPY . .

# Build the project
RUN dotnet build "NavbharatAgroAPI.csproj" -c Release -o /app/build

# Publish the project
FROM build AS publish
RUN dotnet publish "NavbharatAgroAPI.csproj" -c Release -o /app/publish --no-build /p:UseAppHost=false

# Final stage/image
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "NavbharatAgroAPI.dll"]
