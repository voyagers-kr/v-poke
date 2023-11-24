#!/usr/bin/env node

import {getPokeImageByNumber, getProjectVersion, initBackend} from './src/index.js';
import { program } from 'commander';

program
    .option('-v, --version', 'version')
    .option('-gpi, --getPokeImage <value>', 'get poke image')
    .option('-s, --start', 'start CLI Pokédex')
    .action((options) => {
        if(options.version) {
            console.log(`v-poke version ${getProjectVersion()}`);
        } else if(options.getPokeImage) {
            getPokeImageByNumber(options.getPokeImage);
        } else if(options.start) {
            initBackend();
        } else {
            console.log("Please enter the correct command.");
        }
    })
    .parse(process.argv);