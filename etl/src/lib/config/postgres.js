export default () => ({
  dialect: "postgres",
  logging: false,
  host: process.env.POSTGRES_HOST || "localhost",
  username: process.env.POSTGRES_USERNAME || "postgres",
  password: process.env.POSTGRES_PASSWORD || "docker",
  database: process.env.POSTGRES_DATABASE || "dev-incanto",
  pool: {
    max: 10, // DEFAULT: 5
    min: 0,
    acquire: (60 * 1000),  // DEFAULT: 30000
    idle: (20 * 1000), // DEFAULT: 10000
  },
  dialectOptions: {
    requestTimeout: (5 * 1000)
  },
  define: {
    timestamps: true,
    underscore: true,
  },
});
