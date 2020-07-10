import yargs = require('yargs');
import { Lox } from './lox/bootstrap';

const args = yargs.options({
    source: {
        type: 'string',
        alias: [
            's',
            'src'
        ],
        describe: 'Path to Lox source file to compile'
    }
}).argv;

console.log(args);
Lox.main(args.source);