import { Ivr, IvrAction, IvrId } from "../../domain/aggregates/entities/Ivr";
import { An } from "./An";

export const DEFAULT_IVR_ID: IvrId = new IvrId("1");

export class IvrBuilder {
    private ivrId: IvrId = DEFAULT_IVR_ID;
    private actions: Array<IvrAction> = new Array(An.IvrAction().build());
    private noActions = false;

    resetActions(): IvrBuilder {
        this.actions = [];
        return this;
    }

    withAction(action: IvrAction): IvrBuilder {
        this.actions.push(action);
        return this;
    }

    withoutActions() {
        this.noActions = true;
        return this;
    }

    build(): Ivr {
        return new Ivr(this.ivrId, this.noActions ? [] : this.actions);
    }
}