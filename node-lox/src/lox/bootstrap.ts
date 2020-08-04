import readline = require('readline');
import { promises as fs } from 'fs';
import { Scanner } from './scanner';
import { ScanError } from './error';
import { Parser } from './parser';
import { AstPrinter } from './ast-printer';

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
                    Lox.run(line);
                    terminal.prompt();
                    break;
            }
        });     
        
        return new Promise<void>(resolve => terminal.on('close', resolve));
    }

    private static run(source:string){
        try {
            const scanner = new Scanner(source);
            scanner.scanTokens();
            scanner.tokens.forEach(t => console.log(t));

            const parser = new Parser(scanner.tokens);       
            const exp = parser.parse();     

            if(exp){
                const printer = new AstPrinter();
                printer.print(exp);
            }
        }
        catch(e) {
            if(e instanceof ScanError){
                console.error(e.toString());
            }
            else {
                throw e;
            }
        }
    }
}
