import "dotenv/config";
import express from "express";
import routes from "./routes";
import cors from "cors";

const app = express();
const port = process.env.PORT ?? "3000";

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(port, () => {
  console.log(`Express is listening at http://localhost:${port}`);
});
