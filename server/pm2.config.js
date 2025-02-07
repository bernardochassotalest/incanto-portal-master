module.exports = {
  apps : [{
    name      : "incanto-server",
    script    : "dist/index.js",
    node_args : "-r dotenv/config",
    env: {
      "NODE_ENV": "production",
      "DEBUG": "inca*",
      "TZ": "America/Sao_Paulo"
    }
  }]
}
