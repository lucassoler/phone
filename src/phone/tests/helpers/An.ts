import { IvrActionBuilder } from "./IvrActionBuilder";
import { IvrBuilder } from "./IvrBuilder";
import { OutcallBuilder } from "./OutcallBuilder";

export class An {
    static Outcall(): OutcallBuilder {
        return new OutcallBuilder();
    }
    static Ivr(): IvrBuilder {
        return new IvrBuilder();
    } 
    static IvrAction(): IvrActionBuilder {
        return new IvrActionBuilder();
    } 
}
