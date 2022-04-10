import { IvrBuilder } from "./IvrBuilder";
import { OutcallBuilder } from "./OutcallBuilder";

export class An {
    static Outcall(): OutcallBuilder {
        return new OutcallBuilder();
    }
    static Ivr(): IvrBuilder {
        return new IvrBuilder();
    } 
}
