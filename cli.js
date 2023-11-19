#!/usr/bin/env node

import {getAscii, getProjectVersion } from './src/index.js';
import { program } from 'commander';

program
    .option('-v, --version', 'version')
    .option('-ga, --getAscii <value>', 'test')
    .action((options) => {
        if(options.version) {
            console.log(`v-poke version ${getProjectVersion()}`);
        } else if(options.getAscii){
            getAscii(options.getAscii);
        }
    })
    .parse(process.argv);