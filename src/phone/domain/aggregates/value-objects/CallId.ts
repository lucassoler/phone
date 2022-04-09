
export class CallId {
    public readonly id: string;

    private constructor(value: string) {
        this.id = value;
    }

    static from(callId: string): CallId {
        return new CallId(callId);
    }

    sameAs(idToCompare: CallId): boolean {
        return this.id == idToCompare.id;
    }
}
