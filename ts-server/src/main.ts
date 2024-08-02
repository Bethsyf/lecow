import "dotenv/config";
import express from "express";
import routes from "./routes";

const app = express();
const port = process.env.PORT ?? "3000";

app.use(express.json());
app.use(routes);

app.listen(port, () => {
  console.log(`Express is listening at http://localhost:${port}`);
});