import { Token, TokenType } from './token';
import { SyntaxError } from './error';

export class Scanner {
    public readonly tokens:Token[] = [];
    /**
     * The position in the current line of the first character in the current lexeme.
     */
    private start = 0;
    /**
     * The current character position within the entire source string.
     */
    private current = 0;
    private line = 1;

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

        this.tokens.push(new Token(TokenType.EOF, '', null, this.line));
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
                    while(this.peek() !== '\n' && !this.isAtEnd) {
                        this.advance();
                    }
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
                this.line++;
                break;
            default:
                if(isDigit(char)){
                    this.consumeNumber();
                }
                else {
                    throw new SyntaxError(this.line, 'Unexpected character.');
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
            throw new SyntaxError(this.line, 'Unterminated string');
        }

        // closing quote
        this.advance();

        const val = this.source.substring(this.start + 1, this.current - 1);
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

        const val = parseFloat(this.source.substring(this.start, this.current));
        this.addToken(TokenType.NUMBER, val);
    }

    private addToken(type:TokenType, literal:string|number|null = null){
        const text = this.source.substring(this.start, this.current);
        const token = new Token(type, text, literal, this.line);
        this.tokens.push(token);
    }
}

function isDigit(char:string){
    const maybeDigit = parseInt(char);
    return !isNaN(maybeDigit) 
        && maybeDigit >= 0
        && maybeDigit <= 9;
}