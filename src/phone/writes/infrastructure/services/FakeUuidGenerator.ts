import { UuidGenerator } from "../../usecases/services/uuidGenerator";
import {v4 as uuidv4} from 'uuid';

export class FakeUuidGenerator implements UuidGenerator {
    private nextId: string = '1';
    
    next(id: string): void {
        this.nextId = id;
    }
    generate(): string {
        return this.nextId;
    }
} 