import { 
    ExpressionVisitor,
    LiteralExp,
    GroupingExp,
    BinaryExp,
    UnaryExp,
    Expression,
    ExpressionType,
    StringExp
} from './expression';
import { TokenType, Token } from './token';
import { 
    LiteralValue, 
    coerceTruthiness, 
    isEqual,
    isNumber,
    isString 
} from '../common';
import { RuntimeError } from './error';

export class Interpreter extends ExpressionVisitor<LiteralValue>{
    public interpret(exp:Expression<string>){
        const value = this.evaluate(exp);
        console.log(this.stringify(value));

        return value;
    }

    protected visitLiteralExp(exp:LiteralExp){
        return exp.value;
    }

    protected visitGroupingExp(exp:GroupingExp){
        return this.evaluate(exp.expression)
    }

    protected visitUnaryExp(exp:UnaryExp){
        const right = this.evaluate(exp.right);
        const { operator } = exp;

        switch(operator.type){
            case TokenType.BANG:
                return !coerceTruthiness(right);
            case TokenType.MINUS:
                if(!assertNumber(operator, right)) {
                    return null;
                }

                return right * -1;
            default:
                return null;
        }
    }

    protected visitBinaryExp(exp:BinaryExp){
        const right = this.evaluate(exp.right);
        const left = this.evaluate(exp.left);
        const { operator } = exp;

        if(
            right === null || 
            left === null || 
            typeof right === 'boolean' || 
            typeof left === 'boolean'
        ){
            throw new RuntimeError(operator, 'Operands must be two numbers or two strings.');
        }

        // string or number operations
        switch(operator.type){
            case TokenType.EQUAL_EQUAL: 
                return isEqual(left, right);
             case TokenType.BANG_EQUAL: 
                return !isEqual(left, right);
            case TokenType.PLUS:
                if(isString(left) && isString(right)){
                    return left.concat(right);
                }
        }

        if(!(assertNumber(operator, left) && assertNumber(operator, right))){
            return null;
        }

        // number-only operations
        switch(operator.type){
            case TokenType.MINUS:
                return left - right;            
            case TokenType.SLASH:
                return left / right;
            case TokenType.STAR:
                return left * right;
            case TokenType.GREATER:
                return left > right;
            case TokenType.GREATER_EQUAL:
                return left >= right;
            case TokenType.LESS:
                return left < right;
            case TokenType.LESS_EQUAL:
                return left <= right;
            case TokenType.PLUS:               
                return left + right;
        }

        return null;
    }

    private evaluate(exp:Expression<LiteralValue>):LiteralValue{
        return exp.accept(this);
    }

    private stringify(obj:Object|null){
        if(obj === null){
            return 'nil';
        }

        return obj.toString();
    }
}

function assertNumber(operator:Token, operand:LiteralValue):operand is number{
    if(!isNumber(operand)){
        throw new RuntimeError(operator, 'Operand must be a number');
    }    

    return true;
}