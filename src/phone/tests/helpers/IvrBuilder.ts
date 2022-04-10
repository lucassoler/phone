import { Ivr, IvrAction, IvrId } from "../../domain/aggregates/entities/Ivr";

export const DEFAULT_IVR_ID: IvrId = new IvrId("1");

export class IvrBuilder {
    private ivrId: IvrId = DEFAULT_IVR_ID;
    private actions: Array<IvrAction> = new Array();

    withAction(action: IvrAction): IvrBuilder {
        this.actions.push(action);
        return this;
    }

    build(): Ivr {
        return new Ivr(this.ivrId, this.actions);
    }
}