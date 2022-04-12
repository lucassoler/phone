import dotenv from "dotenv";
import { ExpressServer } from "./configuration/express/ExpressServer";
import { serviceLocator } from "./configuration/services/serviceLocator";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const services = serviceLocator();

const expressServer = new ExpressServer().create(services);

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

function asValue(arg0: string): import("awilix").Resolver<any> | undefined {
  throw new Error("Function not implemented.");
}
