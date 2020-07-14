export class SyntaxError {
    constructor(
        public readonly line:number,
        public readonly message:string,
        public readonly where?:string,
    ){}

    public toString(){
        if(this.where){
            return `[line ${this.line}] Error ${this.where}: ${this.message}`;
        }
        else {
            return `[line ${this.line}] Error: ${this.message}`;
        }
    }
}