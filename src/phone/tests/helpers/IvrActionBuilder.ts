import { IvrAction, IvrActionType } from "../../domain/aggregates/entities/Ivr";

export class IvrActionBuilder {
    private type: IvrActionType = IvrActionType.Say;
    private message: string = "Hello";

    saying(message: string): IvrActionBuilder {
        this.type = IvrActionType.Say;
        this.message = message;
        return this;
    }

    build(): IvrAction {
        return new IvrAction(this.type, this.message);
    }
}