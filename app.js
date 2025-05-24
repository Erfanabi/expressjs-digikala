const express = require("express");
const dotenv = require("dotenv");
const mainRouter = require("./src/app.routes");

dotenv.config();

async function main() {
  const app = express();

  require("./src/config/sequelize.config");

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(mainRouter);

  app.use((req, res, next) => {
    return res.status(404).send("Not Found Route");
  });

  app.use((err, req, res, next) => {
    const status = err?.status ?? err?.statusCode ?? 500;
    let message = err?.message ?? "internal server error";

    if (err?.name === "ValidationError") {
      const { details } = err;
      message = details?.body?.[0]?.message ?? "internal server error";
    }

    return res.status(status).json({
      message,
    });
  });

  let port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

main().catch(error => {
  console.error(`Error in main: ${error.message}`);
  process.exit(1);
});
