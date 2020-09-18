import { 
    BinaryExp,
    UnaryExp,
    GroupingExp,
    LiteralExp,
    Expression,
    ExpressionVisitor
} from './expression';

export class AstPrinter extends ExpressionVisitor<string> {
    public print(exp:Expression<string>){
        const expression = exp.accept(this);
        console.log(expression);
    }

    protected visitUnaryExp(exp:UnaryExp){
        return this.parenthesize(exp.operator.lexeme ?? '', exp.right);
    }

    protected visitBinaryExp(exp:BinaryExp){
        return this.parenthesize(exp.operator.lexeme ?? '', exp.left, exp.right);
    }

    protected visitGroupingExp(exp:GroupingExp){
        return this.parenthesize('group', exp.expression);
    }

    protected visitLiteralExp(exp:LiteralExp){
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