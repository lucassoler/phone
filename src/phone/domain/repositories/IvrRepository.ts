import { Ivr } from "../aggregates/entities/Ivr";

export interface IvrRepository {
    load(ivrId: string): Promise<Ivr>;

}