import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { readFileSync } from "fs";
import { join } from "path";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get("/api/download/:doc", (req, res) => {
    const docs: Record<string, string> = {
      brd: "SugarHive_BRD.md",
      "user-stories": "SugarHive_User_Stories.md",
    };
    const filename = docs[req.params.doc];
    if (!filename) {
      res.status(404).json({ error: "Document not found" });
      return;
    }
    try {
      const filePath = join(process.cwd(), filename);
      const content = readFileSync(filePath, "utf-8");
      res.setHeader("Content-Type", "text/markdown; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
      res.send(content);
    } catch {
      res.status(404).json({ error: "File not found" });
    }
  });

  return httpServer;
}
