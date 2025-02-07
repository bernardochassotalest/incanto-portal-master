module.exports = {
  apps: [
    {
      name: "incanto-etl-main",
      script: "dist/index.js",
      node_args: "-r dotenv/config --max_old_space_size=8192",
      env: {
        NODE_ENV: "production",
        DEBUG: "incanto*",
        "TZ": "America/Sao_Paulo"
      },
    },
    {
      name: "incanto-etl-master",
      script: "dist/index.js",
      node_args: "-r dotenv/config --max_old_space_size=8192",
      env: {
        NODE_ENV: "production",
        DEBUG: "incanto*",
        "TZ": "America/Sao_Paulo"
      },
    },
    {
      name: "incanto-etl-slave",
      script: "dist/index.js",
      node_args: "-r dotenv/config --max_old_space_size=8192",
      env: {
        NODE_ENV: "production",
        DEBUG: "incanto*",
        "TZ": "America/Sao_Paulo"
      },
    }
  ],
};
