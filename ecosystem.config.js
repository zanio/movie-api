module.exports = {
  apps : [{
    name: "app",
    script: "./bin/start.ts",
    instances: "max",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}
