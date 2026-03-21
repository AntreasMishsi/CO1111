// @ts-check



export class Stage {

    async OnStart() {
        throw new Error("Abstract method 'OnStart' must be implemented by subclass");
    }
    async OnEnd() {
        throw new Error("Abstract method 'OnEnd' must be implemented by subclass");
    }

}

