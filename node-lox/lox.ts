import yargs = require('yargs');
import { Lox } from './src/lox';

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
Lox.main(args.source)
    .then(() => process.exit(0))
    .catch(e => {
        console.error(e);
        process.exit(65)
    });