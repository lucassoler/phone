import http from 'http';
import { ExpressServer } from '../../../../configuration/express/ExpressServer';
import { serviceContainer } from '../../../../configuration/services/serviceContainer';

export class ExpressServerHelper {
    private server: http.Server = new ExpressServer().create(serviceContainer()).listen();

    stop() {
        this.server.close();
    }

    get(): http.Server {
        return this.server;
    }
}