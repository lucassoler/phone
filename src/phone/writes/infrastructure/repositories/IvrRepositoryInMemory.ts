import { Ivr, IvrId } from "../../domain/aggregates/entities/Ivr";
import { IvrNotFound } from "../../domain/exceptions/IvrNotFound";
import { IvrRepository } from "../../domain/repositories/IvrRepository";

export class IvrRepositoryInMemory implements IvrRepository {
    constructor(public ivrs: Array<Ivr> = new Array()) {
        
    }
    async load(ivrId: IvrId): Promise<Ivr> {
        const ivr = this.ivrs.find(x => x.id.sameAs(ivrId.id));
        if(!ivr) throw new IvrNotFound(ivrId.id);
        return Promise.resolve(ivr)
    }
}