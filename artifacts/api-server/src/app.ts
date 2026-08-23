import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import path from "path";
import fs from "fs";
import { ensureDirs, UPLOADS_DIR, RENDERS_DIR, VOICEOVERS_DIR } from "./lib/uploads";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Ensure upload directories exist
ensureDirs();

// Serve static files for uploaded/rendered content
app.use("/api/files/uploads", express.static(UPLOADS_DIR));
app.use("/api/files/renders", express.static(RENDERS_DIR));
app.use("/api/files/voiceovers", express.static(VOICEOVERS_DIR));

app.use("/api", router);

export default app;
