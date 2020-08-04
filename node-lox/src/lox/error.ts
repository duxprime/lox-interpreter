import { Token, TokenType } from './token';

export class ScanError {
    constructor(
        public readonly line:number,
        public readonly column:number,
        public readonly message:string,
        public readonly where?:string,
    ){}

    public toString(){
        if(this.where){
            return `[line ${this.line}; column: ${this.column}] Error ${this.where}: ${this.message}`;
        }
        else {
            return `[line ${this.line}; column ${this.column}] Error: ${this.message}`;
        }
    }
}

export class ParseError {
    constructor(
        private token:Token,
        private msg:string
    ){
    }

    public toString(){
        if(this.token.type === TokenType.EOF){
            return `${this.token.line} at end ${this.msg}`;
        }
        else {
            return `${this.token.line} at ${this.token.lexeme} ${this.msg}`;
        }
    }
}