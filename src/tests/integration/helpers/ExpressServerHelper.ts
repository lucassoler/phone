import http from 'http';
import { ExpressServer } from '../../../../configuration/express/ExpressServer';

export class ExpressServerHelper {
    private server: http.Server = new ExpressServer().create().listen();

    stop() {
        this.server.close();
    }

    get(): http.Server {
        return this.server;
    }
}