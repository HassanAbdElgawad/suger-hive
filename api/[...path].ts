import express from "express";
import { createServer } from "http";
import { registerRoutes } from "../server/routes";

const app = express();
const httpServer = createServer(app);

app.use(
  express.json({
    verify: (req, _res, buf) => {
      (req as any).rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

let initialized = false;

async function ensureInitialized() {
  if (initialized) return;
  await registerRoutes(httpServer, app);
  initialized = true;
}

export default async function handler(req: any, res: any) {
  await ensureInitialized();
  return app(req, res);
}
