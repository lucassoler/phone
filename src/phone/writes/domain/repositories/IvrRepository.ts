import { Ivr, IvrId } from "../aggregates/entities/Ivr";

export interface IvrRepository {
    load(ivrId: IvrId): Promise<Ivr>;

}