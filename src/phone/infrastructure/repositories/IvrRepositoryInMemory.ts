import { Ivr } from "../../domain/aggregates/entities/Ivr";
import { IvrNotFound } from "../../domain/exceptions/IvrNotFound";
import { IvrRepository } from "../../domain/repositories/IvrRepository";

export class IvrRepositoryInMemory implements IvrRepository {
    constructor(public ivrs: Array<Ivr> = new Array()) {
        
    }
    async load(ivrId: string): Promise<Ivr> {
        const ivr = this.ivrs.find(x => x.id.sameAs(ivrId));
        if(!ivr) throw new IvrNotFound(ivrId);
        return Promise.resolve(ivr)
    }
}