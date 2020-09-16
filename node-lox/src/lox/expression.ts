import { Token } from './token';
import { LiteralValue } from '../common';

export enum ExpressionType {
    BinaryOperator = 'BinaryOperator',
    UnaryOperator = 'UnaryOperator',
    Grouping = 'Grouping',
    Literal = 'Literal'
}

export interface ExpressionVisitor<R = void> {
    visitUnaryExp(exp:UnaryExp):R;
    visitBinaryExp(exp:BinaryExp):R;
    visitGroupingExp(exp:GroupingExp):R;
    visitLiteralExp(exp:LiteralExp):R;
}

export abstract class Expression<R = void> {
    readonly abstract type:ExpressionType
    public abstract accept(visitor:ExpressionVisitor<R>):R;
}

export class BinaryExp extends Expression<string> {
    public type = ExpressionType.BinaryOperator;
    constructor(
        public readonly left:Expression<string>,
        public readonly operator:Token,
        public readonly right:Expression<string>,
    ){
        super();
    }

    public accept(visitor:ExpressionVisitor<string>) {
        return visitor.visitBinaryExp(this);
    }
}

export class UnaryExp extends Expression<string> {
   public type = ExpressionType.UnaryOperator;
   constructor(
        public readonly operator:Token,
        public readonly right:Expression<string>
   ){
       super();
   }

   public accept(visitor:ExpressionVisitor<string>){
       return visitor.visitUnaryExp(this);
   }
}

export class GroupingExp extends Expression<string> {
    public type = ExpressionType.Grouping;
    constructor(
        public readonly expression:Expression<string>
    ){
        super();
    }

    public accept(visitor:ExpressionVisitor<string>) {
        return visitor.visitGroupingExp(this);
    }
}

export class LiteralExp extends Expression<string> {
    public type = ExpressionType.Literal;
    constructor(
        public readonly value:LiteralValue
    ){
        super();
    }

    public accept(visitor:ExpressionVisitor<string>){
        return visitor.visitLiteralExp(this);
    }
}

