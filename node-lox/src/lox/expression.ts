import { Token } from './token';
import { LiteralValue } from '../common';

export enum ExpressionType {
    BinaryOperator = 'BinaryOperator',
    UnaryOperator = 'UnaryOperator',
    Grouping = 'Grouping',
    Literal = 'Literal'
}

interface Visitor<R = void> {
    visit(exp:Expression<R>):R;
}

export abstract class ExpressionVisitor<R> implements Visitor<R> {
    protected abstract visitUnaryExp(exp:UnaryExp):R;
    protected abstract visitBinaryExp(exp:BinaryExp):R;
    protected abstract visitGroupingExp(exp:GroupingExp):R;
    protected abstract visitLiteralExp(exp:LiteralExp):R;

    public visit(exp:Expression<R>){
        if(exp instanceof LiteralExp){
            return this.visitLiteralExp(exp);
        }
        else if (exp instanceof GroupingExp) {
            return this.visitGroupingExp(exp);
        }
        else if(exp instanceof UnaryExp) {
            return this.visitUnaryExp(exp);
        }
        else if(exp instanceof BinaryExp){
            return this.visitBinaryExp(exp);
        }
        else {
            throw new Error('Invalid expression type');
        }
    }
}

export abstract class Expression<R = void> {
    readonly abstract type:ExpressionType;
    public accept(visitor:Visitor<R>):R {
        return visitor.visit(this);
    };
}

export class BinaryExp extends Expression<string> {
    public readonly type = ExpressionType.BinaryOperator;
    constructor(
        public readonly left:Expression<string>,
        public readonly operator:Token,
        public readonly right:Expression<string>,
    ){
        super();
    }
}

export class UnaryExp extends Expression<string> {
   public readonly type = ExpressionType.UnaryOperator;
   constructor(
        public readonly operator:Token,
        public readonly right:Expression<string>
   ){
       super();
   }
}

export class GroupingExp extends Expression<string> {
    public readonly type = ExpressionType.Grouping;
    constructor(
        public readonly expression:Expression<string>
    ){
        super();
    }
}

export class LiteralExp extends Expression<string> {
    public readonly type = ExpressionType.Literal;
    constructor(
        public readonly value:LiteralValue
    ){
        super();
    }
}

export type StringExp = LiteralExp | GroupingExp | UnaryExp | BinaryExp;