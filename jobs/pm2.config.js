module.exports = {
  apps : [
    {
      name      : "incanto-jobs-queue",
      script    : "dist/queue.js",
      node_args : "-r dotenv/config --max_old_space_size=16384",
      env: {
       "NODE_ENV": "production",
       "DEBUG": "incanto*",
       "TZ": "America/Sao_Paulo"
     }
    },
    {
      name      : "incanto-jobs-server",
      script    : "dist/index.js",
      node_args : "-r dotenv/config --max_old_space_size=16384",
      env: {
       "NODE_ENV": "production",
       "DEBUG": "incanto*",
       "TZ": "America/Sao_Paulo"
      }
    },
  ]
}
