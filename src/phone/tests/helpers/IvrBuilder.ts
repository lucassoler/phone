import { Ivr, IvrId } from "../../domain/aggregates/entities/Ivr";

export const DEFAULT_IVR_ID: IvrId = new IvrId("1");

export class IvrBuilder {
    ivrId: IvrId = DEFAULT_IVR_ID;

    build(): Ivr {
        return new Ivr(this.ivrId);
    }
}