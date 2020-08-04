import { Token, TokenType } from './token';
import { Expression, BinaryExp, UnaryExp, LiteralExp, GroupingExp } from './expression';
import { ParseError } from './error';

export class Parser {
    /**
     * Current position within the list of tokens.
     */
    private position = 0;

    private get previous() {
        return this.tokens[this.position - 1];
    }

    private get current(){
        return this.tokens[this.position];
    }

    private get isAtEnd(){
        return this.current.type === TokenType.EOF;
    }

    constructor(private tokens:Token[]){
    }

    public parse(){
        try {
            return this.expandExpression();
        } 
        catch(e){
            if(e instanceof ParseError){
                // synchronize state later
                console.error(e.toString());
            }
            else{
                throw e;
            }
        }
    }

    /**
     * Consumes and returns the current token.
     * Advances to the next token.
     */
    private advance(){
        const current = this.current;
        if(!this.isAtEnd){
            this.position++;
        }

        return current;
    }

    /**
     * Consume the current token if it matches one of the provided types.
     * 
     * @returns Whether or not the token was consumed.
     */
    private advanceMatch(...types:TokenType[]){
        const match = types.some(type => {
            if(this.check(type)) {
                this.advance();

                return true;
            }
        });

        return match;
    }

    /**
     * Returns `true` if the current token is of the given type.
     * 
     * @param type 
     */
    private check(type:TokenType){
        if(this.isAtEnd) {
            return false;
        }

        return this.current.type === type;
    }

    /**
     * Discard tokens until encountering a statement boundary 
     * after encountering a parse error. Corrects parser state
     * to avoid cascading errors.
     */
    private synchronize(){
        this.advance();

        while(!this.isAtEnd){
            if(this.previous.type === TokenType.SEMICOLON){
                break;
            }

            switch(this.current.type){
                case TokenType.CLASS:
                case TokenType.FUN:
                case TokenType.VAR:
                case TokenType.FOR:
                case TokenType.IF:
                case TokenType.WHILE:
                case TokenType.PRINT:
                case TokenType.RETURN:
                    return;
            }
        }

        this.advance();
    }

    private expandExpression() {
        return this.expandEquality();
    }

    private expandEquality() {
        let exp = this.expandComparison();

        while(this.advanceMatch(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL)){
            const operator = this.previous;
            const right = this.expandComparison();
            exp = new BinaryExp(exp, operator, right);
        }

        return exp;
    }

    private expandComparison(){
        let exp = this.expandAddition();

        const matchTypes = [
            TokenType.GREATER, 
            TokenType.EQUAL, 
            TokenType.LESS, 
            TokenType.LESS_EQUAL
        ];

        while(this.advanceMatch(...matchTypes)){
            const operator = this.previous;
            const right = this.expandAddition();
            exp = new BinaryExp(exp, operator, right);
        }

        return exp;
    }

    private expandAddition(){
        let exp = this.expandMultiplication();

        while (this.advanceMatch(TokenType.MINUS, TokenType.PLUS)) {
          const operator = this.previous;
          const right = this.expandMultiplication();
          exp = new BinaryExp(exp, operator, right);
        }
    
        return exp;
    }

    private expandMultiplication(){
        let exp = this.expandUnary();

        while (this.advanceMatch(TokenType.SLASH, TokenType.STAR)) {
          const operator = this.previous;
          const right = this.expandUnary();
          exp = new BinaryExp(exp, operator, right);
        }
    
        return exp;
    }

    private expandUnary():Expression<string> {
        if (this.advanceMatch(TokenType.BANG, TokenType.MINUS)) {
          const operator = this.previous;
          const right = this.expandUnary();

          return new UnaryExp(operator, right);
        }
    
        return this.expandPrimary();
    }

    private expandPrimary(){
        if (this.advanceMatch(TokenType.FALSE)) {
            return new LiteralExp(false);
        } 
        else if (this.advanceMatch(TokenType.TRUE)) {
            return new LiteralExp(true);
        }
        else if (this.advanceMatch(TokenType.NIL)) {
            return new LiteralExp(null);
        }    
        else if (this.advanceMatch(TokenType.NUMBER, TokenType.STRING)) {
            return new LiteralExp(this.previous.literal ?? '');
        }    
        else if (this.advanceMatch(TokenType.LEFT_PAREN)) {
          const exp = this.expandExpression();
          if(!this.advanceMatch(TokenType.RIGHT_PAREN)){
            throw new ParseError(this.current, 'Expected ")" after expression.');
          }

          return new GroupingExp(exp);
        }
        else {
            throw new ParseError(this.current, 'Expected expression.');
        }
    }
}