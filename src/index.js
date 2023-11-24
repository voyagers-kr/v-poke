import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import asciiChanger from 'asciify-image';
import fetch from 'node-fetch';

// 기존의 fetch를 따로 저장
const originalFetch = fetch;

// ExperimentalWarning를 노출시키지 않기 때문에 fetch를 오버라이드
global.fetch = (url, options) => {
    return originalFetch(url, options);
};

export const getPokeImageByNumber = (number) => {
    const imageRequestUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${number}.png`
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