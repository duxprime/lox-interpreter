export enum TokenType {
    // Single-character tokens.
    LEFT_PAREN = 'Left Paren', 
    RIGHT_PAREN = 'Right Paren', 
    LEFT_BRACE = 'Left Brace', 
    RIGHT_BRACE = 'Right Brace',
    COMMA = 'Comma', 
    DOT = 'Dot', 
    MINUS = 'Minus', 
    PLUS = 'Plus', 
    SEMICOLON = 'Semicolon', 
    SLASH = 'Slash', 
    STAR = 'Star',
  
    // One or two character tokens.
    BANG = 'Not', 
    BANG_EQUAL = 'Not Equal',
    EQUAL = 'Equal', 
    EQUAL_EQUAL = 'Equal Equal',
    GREATER = 'Greater Than', 
    GREATER_EQUAL = 'Greater Than Or Equal To',
    LESS = 'Less Than', 
    LESS_EQUAL = 'Less Than Or Equal To',
  
    // Literals.
    IDENTIFIER = 'Identifier', 
    STRING = 'String', 
    NUMBER = 'Number',
  
    // Keywords.
    AND = 'And', 
    CLASS = 'Class', 
    ELSE = 'Else', 
    FALSE = 'False', 
    FUN = 'Function', 
    FOR = 'For', 
    IF = 'If', 
    NIL = 'Nil', 
    OR = 'Or',
    PRINT = 'Print', 
    RETURN = 'Return', 
    SUPER = 'Super', 
    THIS = 'This', 
    TRUE = 'True', 
    VAR = 'Var', 
    WHILE = 'While',
  
    EOF = 'End'
}

export class Token {
    constructor(
        public readonly type:TokenType,
        public readonly line:number,
        public readonly lexeme?:string,
        public readonly literal?:string|number
    ){
    }

    public toString(){
        return `${this.type} ${this.lexeme} ${this.literal || ''}`;
    }
}