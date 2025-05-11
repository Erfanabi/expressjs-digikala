const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

async function main() {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use((req, res, next) => {
    return res.status(404).send("Not Found Route");
  });

  app.use((err, req, res, next) => {
    const status = err?.status ?? 500;
    const message = err?.message ?? "internal server error";
    return res.status(status).json({ message });
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
