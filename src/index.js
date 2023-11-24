import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import asciiChanger from 'asciify-image';

export const getPokeImageByNumber = (number) => {
    const imageRequestUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${number}.png`
    console.log(imageRequestUrl);
    getAscii(imageRequestUrl);
}


export const getProjectVersion = () => {
// version 값
    const currentModulePath = new URL(import.meta.url).pathname;
    const currentDir = dirname(currentModulePath);
    const packageJsonPath = join(currentDir, '..', '/package.json');
    const packageJsonContent = readFileSync(packageJsonPath, 'utf-8');
    const { version } = JSON.parse(packageJsonContent);
    return version;
}

export const getAscii = (imageUrl) => {

    const options = {
        fit:    'box',
        width:  40,
        height: 40
    }

    asciiChanger(imageUrl, options, function (err, asciified) {
        if (err) throw err;

        // Print to console
        console.log(asciified);
    });
};
