import express, {Express} from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import cors from 'cors';
import { ExpressMiddlewares } from './ExpressMiddlewares';
import { router } from './ExpressRouter';
import { Dependencies } from '../services/serviceLocator';

  export class ExpressServer {
    constructor() {

    }

    create(services: Dependencies): Express {
        const server = express();

        server.set('port', process.env.API_PORT || 8801);
        server.use(helmet());

        server.use(ExpressMiddlewares.configureServices(services));

        if (process.env.NODE_ENV !== "production") {
            server.use(ExpressMiddlewares.prepareResponseHeader());
            server.use(cors());
        }

        server.use(bodyParser.json());
        server.use(bodyParser.urlencoded({extended: true}));

        server.use('/api', router(services));

        //server.use(ExpressMiddlewares.postErrorHandling(this.dependencies.logger));

        return server;
    }
}