import dotenv from "dotenv";
import { ExpressServer } from "./configuration/express/ExpressServer";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const expressServer = new ExpressServer().create();

const server = expressServer.listen(expressServer.get("port"), () => {
  console.info(`Application starts on port ${expressServer.get("port")}`, { type: "SYSTEM" });
});

process.on("SIGTERM", () => {
  console.warn("Application stopped", { type: "SYSTEM" });
    server.close((error) => {
        if (error) {
            console.error(error.message, { type: "SYSTEM" });
            process.exit(1);
        }

        process.exit(0);
    });
});