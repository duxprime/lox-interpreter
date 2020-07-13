import { number } from "yargs"

export class SyntaxError {
    constructor(
        public readonly line:number,
        public readonly where:string,
        public readonly message:string,
    ){}

    public toString(){
        return `[line ${this.line}] Error ${this.where} : ${this.message}`;
    }
}