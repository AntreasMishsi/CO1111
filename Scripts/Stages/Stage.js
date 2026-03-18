// @ts-check



export class Stage {

    OnStart() {
        throw new Error("Abstract method 'OnStart' must be implemented by subclass");
    }
    OnEnd() {
        throw new Error("Abstract method 'OnEnd' must be implemented by subclass");
    }

}

