import { Token, TokenType } from './token';
import { ScanError } from './error';

export class Scanner {
    private static keywordsMap = new Map<string, TokenType>([
        ['and', TokenType.AND],
        ['class', TokenType.CLASS],
        ['else', TokenType.ELSE],
        ['false', TokenType.FALSE],
        ['for', TokenType.FOR],
        ['fun', TokenType.FUN],
        ['if', TokenType.IF],
        ['nil', TokenType.NIL],
        ['or', TokenType.OR],
        ['print', TokenType.PRINT],
        ['return', TokenType.RETURN],
        ['super', TokenType.SUPER],
        ['this', TokenType.THIS],
        ['true', TokenType.TRUE],
        ['var', TokenType.VAR],
        ['while', TokenType.WHILE]
    ]);
    
    public readonly tokens:Token[] = [];
    /**
     * The position of the first character in the current lexeme.
     */
    private start = 0;
    /**
     * The current character position within the entire source string.
     */
    private current = 0;
    private line = 1;
    private column = 1;

    private get isAtEnd(){
        return this.current >= this.source.length;
    }

    constructor(
        private source:string
    ){

    }

    public scanTokens() {
        while(!this.isAtEnd){
            this.start = this.current;
            this.scanToken();
        }

        this.tokens.push(new Token(TokenType.EOF, this.line));
    }

    private scanToken(){
        let char:string = this.advance();
        let tokenType:TokenType|undefined;

        switch(char){
            case '(': 
                tokenType = TokenType.LEFT_PAREN; 
                break;
            case ')': 
                tokenType = TokenType.RIGHT_PAREN; 
                break;
            case '{': 
                tokenType = TokenType.LEFT_BRACE; 
                break;
            case '}': 
                tokenType = TokenType.RIGHT_BRACE; 
                break;
            case ',': 
                tokenType = TokenType.COMMA; 
                break;
            case '.': 
                tokenType = TokenType.DOT; 
                break;
            case '-': 
                tokenType = TokenType.MINUS; 
                break;
            case '+': 
                tokenType = TokenType.PLUS; 
                break;
            case ';': 
                tokenType = TokenType.SEMICOLON; 
                break;
            case '*': 
                tokenType = TokenType.STAR; 
                break; 
            case '!': 
                tokenType = this.advanceMatch('=') ? TokenType.BANG_EQUAL : TokenType.BANG; 
                break;
            case '=': 
                tokenType = this.advanceMatch('=') ? TokenType.EQUAL_EQUAL : TokenType.EQUAL; 
                break;
            case '<': 
                tokenType =  this.advanceMatch('=') ? TokenType.LESS_EQUAL : TokenType.LESS; 
                break;
            case '>': 
                tokenType = this.advanceMatch('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER; 
                break;
            case '/':
                if(this.advanceMatch('/')) {
                    this.advanceToEnd();
                }
                else {
                    tokenType = TokenType.SLASH;
                }
                break;
            case '"':
                this.consumeString();
                break;
            case ' ':
            case '\r':
            case '\t':
                // Ignore whitespace.
                break;    
            case '\n':
                this.advanceLine();
                break;
            default:
                if(isDigit(char)){
                    this.consumeNumber();
                }
                else if(isAlpha(char)){
                    this.consumeIdentifier();
                }
                else {
                    throw new ScanError(this.line, this.column, 'Unexpected character.');
                }
                break;                
        }

        if(tokenType){
            this.addToken(tokenType);
        }
    }

    /**
     * Look at a character value relative to the current position without consuming it.
     * 
     * @param next The number of characters to look ahead.
     */
    private peek(next = 0){
        const peekedPos = this.current + next;
        if(this.isAtEnd || peekedPos > this.source.length) {
            return '\0';
        }

        return this.source.charAt(peekedPos);
    }

    /**
     * Consume the next character and return it.
     */
    private advance(){
        const char = this.peek();
        this.current++;
        this.column++;
        return char;
    }

    /**
     * Consume the next character if it matches the expected value.
     * 
     * @param expected The expected character to match against.
     */
    private advanceMatch(expected:string){
        if(this.isAtEnd){
            return false;
        }

        if(this.source.charAt(this.current) !== expected) {
            return false;
        }

        this.advance();
        return true;
    }

    /**
     * Advances the scanner to the end of the line.
     */
    private advanceToEnd(){
        while(this.peek() !== '\n' && !this.isAtEnd) {
            this.advance();
        }
    }

    private advanceLine(){
        this.line++;
        this.column = 1;
    }

    private getLexme(){
        return this.source.substring(this.start, this.current);
    }

    private consumeString(){
        let peeked;
        while((peeked = this.peek()) !== '"' && !this.isAtEnd){
            if(peeked === '\n'){
                this.line++;
            }

            this.advance();
        }

        // unterminated string
        if(this.isAtEnd) {
            throw new ScanError(this.line, this.column, 'Unterminated string');
        }

        // closing quote
        this.advance();

        const lexeme = this.getLexme();
        const val = lexeme.replace('"', '');
        this.addToken(TokenType.STRING, val);
    }

    private consumeNumber(){
        while(isDigit(this.peek())){
            this.advance();
        }

        // look for fractional portion
        const peeked = this.peek();
        const nextPeeked = this.peek(1);
        if(peeked === '.' && isDigit(nextPeeked)){
            // consume decimal point
            this.advance();

            while(isDigit(this.peek())){
                this.advance();
            }
        }

        const val = parseFloat(this.getLexme());
        this.addToken(TokenType.NUMBER, val);
    }

    private consumeIdentifier(){
        let c = this.peek();
        while(isAlpha(c) || isDigit(c)){
            this.advance();
            c = this.peek();
        }

        const lexeme = this.getLexme();
        const type = Scanner.keywordsMap.get(lexeme) ?? TokenType.IDENTIFIER;


        this.addToken(type);
    }

    private addToken(type:TokenType, literal?:string|number){
        const lexeme = this.getLexme();
        const token = new Token(type, this.line, lexeme, literal);
        this.tokens.push(token);
    }
}

function isDigit(char:string){
    const maybeDigit = parseInt(char);
    return !isNaN(maybeDigit) 
        && maybeDigit >= 0
        && maybeDigit <= 9;
}

function isAlpha(char:string){
    return char.length === 1 &&
        (char >= 'a' && char <= 'z') ||
        (char >= 'A' && char <= 'Z') ||
        char === '_';
}