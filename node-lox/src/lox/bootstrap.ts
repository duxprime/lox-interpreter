export class Lox {
    public static main(path?:string){
        if(path){
            Lox.runFile(path);
        }
        else {
            Lox.runPrompt()
        }
    }

    private static runFile(path:string){

    }

    private static runPrompt(){

    }
}

