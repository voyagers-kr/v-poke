#!/usr/bin/env node

import {getAscii, getPokeImageByNumber, getProjectVersion} from './src/index.js';
import { program } from 'commander';

program
    .option('-v, --version', 'version')
    .option('-ga, --getAscii <value>', 'test')
    .option('-gpi, --getPokeImage <value>', 'get poke image')
    .action((options) => {
        if(options.version) {
            console.log(`v-poke version ${getProjectVersion()}`);
        } else if(options.getAscii){
            getAscii(options.getAscii);
        } else if(options.getPokeImage) {
            getPokeImageByNumber(options.getPokeImage);
        }
    })
    .parse(process.argv);