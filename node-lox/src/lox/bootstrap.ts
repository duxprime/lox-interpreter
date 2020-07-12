import readline = require('readline');

const quitChar:string = 'q';

export class Lox {
    public static async main(path?:string){
        if(path){
            Lox.runFile(path);
        }
        else {
            return Lox.runPrompt()
        }
    }

    private static runFile(path:string){

    }

    private static runPrompt(){
        const terminal = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: '> '
        });
        
        terminal.write(`Welcome to Lox. Type source code or press "${quitChar}" to quit.\n`);
        terminal.prompt();

        terminal.on('line', line => {
            line = line.trim();
            switch(line){
                case quitChar: 
                    terminal.close();
                    break;
                default:
                    terminal.prompt();
                    break;
            }
        });     
        
        return new Promise<void>(resolve => terminal.on('close', resolve));
    }
}
