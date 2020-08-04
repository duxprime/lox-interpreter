import { 
    BinaryExp,
    UnaryExp,
    GroupingExp,
    LiteralExp,
    Expression,
    ExpressionVisitor
} from './expression';

export class AstPrinter implements ExpressionVisitor<string> {
    public print(exp:Expression<string>){
        const expression = exp.accept(this);
        console.log(expression);
    }

    public visitUnaryExp(exp:UnaryExp){
        return this.parenthesize(exp.operator.lexeme ?? '', exp.right);
    }

    public visitBinaryExp(exp:BinaryExp){
        return this.parenthesize(exp.operator.lexeme ?? '', exp.left, exp.right);
    }

    public visitGroupingExp(exp:GroupingExp){
        return this.parenthesize('group', exp.expression);
    }

    public visitLiteralExp(exp:LiteralExp){
        if(exp.value === undefined){
            return 'nil';
        }

        return exp.value?.toString() || '';
    }

    private parenthesize(name:string, ...expressions:Expression<string>[]){
        const builder:string[] = [];

        builder.push('(');
        builder.push(name);

        expressions.forEach(exp => {
            builder.push(' ');
            builder.push(exp.accept(this));
        })

        builder.push(')');

        return builder.join('');
    }
}