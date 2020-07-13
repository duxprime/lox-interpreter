import readline = require('readline');
import { promises as fs } from 'fs';
import { Scanner } from './scanner';
import { SyntaxError } from './error';

const quitChar:string = 'q';

export class Lox {
    public static async main(path?:string){
        if(path){
            return Lox.runFile(path);
        }
        else {
            return Lox.runPrompt()
        }
    }

    private static async runFile(path:string){
        let handle:fs.FileHandle|undefined;
        try {
            handle = await fs.open(path, 'r');
            const contents = await handle.readFile({
                encoding: 'utf8'
            });

            return Lox.run(contents);
        }
        finally {
            if(handle){
                handle.close();
            }
        }
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
                    try {
                        Lox.run(line);
                    }
                    catch(e) {
                        if(e instanceof SyntaxError){
                            console.error(e.toString());
                        }
                        else {
                            throw e;
                        }
                    }

                    terminal.prompt();
                    break;
            }
        });     
        
        return new Promise<void>(resolve => terminal.on('close', resolve));
    }

    private static run(source:string){
        const scanner = new Scanner(source);
        const tokens = scanner.scanTokens();

        scanner.tokens.forEach(t => console.log(t));
    }
}
