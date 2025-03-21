require("dotenv").config();

function validateEnvVar(variable, defaultValue) {
    const envVar = process.env[variable];
  
    // Перевірка на існування та непорожнє значення
    if (!envVar || envVar.trim() === "") {
      console.warn(`${variable} is not set or is empty, using default value: ${defaultValue}`);
      return defaultValue;
    }
  
    return envVar;
  }
  

module.exports = {
  database: {
    host: validateEnvVar("DB_HOST", "localhost"),
    user: validateEnvVar("DB_USER", "postgres"), // Default user for PostgreSQL
    password: validateEnvVar("DB_PASSWORD", "password"),
    name: validateEnvVar("DB_NAME", "testTask"),
    dialect: "postgres", // PostgreSQL
    port: validateEnvVar("DB_PORT", 5432), // Default port for PostgreSQL
  },
  server: {
    port: validateEnvVar("PORT", 5000),
    apiUrl: validateEnvVar("API_URL", "http://localhost:5000"),
    clientUrl: validateEnvVar("CLIENT_URL", "http://localhost:3000"),
  }
};
