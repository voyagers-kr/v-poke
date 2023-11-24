import {readFileSync} from 'fs';
import {dirname, join} from 'path';
import asciiChanger from 'asciify-image';
import fetch from 'node-fetch';
import {spawn} from 'child_process';

let isQuizProcess = false;
let randomInt = -1;
let nowScore = 0;

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

export const getHiddenPokeImageByNumber = (number) => {
    const imageRequestUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${number}.png`
    getHiddenAscii(imageRequestUrl);
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

export const getHiddenAscii = (imageUrl) => {

    const options = {
        fit:    'box',
        width:  40,
        height: 40
    }

    asciiChanger(imageUrl, options, function (err, asciified) {
        if (err) throw err;

        // Print to console
        console.log(asciified.replace(/[a-zA-Z]/g, '^'));
    });
};

export function initBackend() {
    const javaProcess = spawn('java', ['-jar', './src/pokemon.jar']);
    console.log('init CLI Pokédex');

    // 쉘에서 문자열 입력을 읽기 위한 이벤트 핸들러
    process.stdin.on('data', async (data) => {
        const input = data.toString().trim();
        const inputArray = input.split(' ');
        if(isQuizProcess) {
            if (isNaN(parseInt(input, 10))) {
                console.log('Please enter Pokemon number');
            } else {
                if (parseInt(input, 10) === randomInt) {
                    console.log('great!');
                    nowScore += randomInt;
                    console.log(`your score is ${nowScore}`);
                    randomInt = getRandomNumber();
                    getHiddenPokeImageByNumber(randomInt)
                    setTimeout(()=> {
                        console.log('please commend pokemon num')
                    }, 2000);
                } else {
                    console.log('fail....');
                    console.log(`your score is ${nowScore}`);
                    console.log('quiz end');
                    isQuizProcess = false;
                    nowScore = 0;
                }
            }
        } else if (input === 'exit') {
            javaProcess.kill();
            console.log('Backend process exited');
            process.exit();  // 자바 프로세스가 종료되면 Node.js도 종료
        } else if (inputArray[0] === 'info') {
            if (inputArray.length <= 1) {
                console.log('Please enter Pokemon number or name');
            } else {
                const target = inputArray[1];
                if (!isNaN(parseInt(target, 10))) {
                    await sendDataAndReceiveOutput(javaProcess, input).then((output) => {
                        setTimeout(() => {
                            console.log(output);
                        }, 2000);
                        getPokeImageByNumber(target);
                    });
                } else {
                    await sendDataAndReceiveOutput(javaProcess, `name ${target}`).then((result) => {
                        const resultArray = result.split(' ');
                        if (!isNaN(parseInt(resultArray[0], 10))) {
                            const targetIndex = parseInt(resultArray[0], 10);
                            sendDataAndReceiveOutput(javaProcess, `info ${targetIndex}`).then((output) => {
                                setTimeout(() => {
                                    console.log(output);
                                }, 2000);
                                const outputArray = output.split(' ');
                                getPokeImageByNumber(targetIndex);
                            });
                        } else {
                            console.log('Please enter Pokemon number or name');
                        }
                    });
                }
            }
        } else if(inputArray[0] === 'quiz') {
            isQuizProcess = true;
            randomInt = getRandomNumber();
            getHiddenPokeImageByNumber(randomInt);
            setTimeout(()=> {
                console.log('please commend pokemon num')
            }, 2000);
        } else {
            console.log("Please enter the correct command or exit!");
        }
    });

// 자바 프로세스 종료 시 이벤트 핸들러
    javaProcess.on('close', (code) => {
        console.log('Backend process exited');
        process.exit();  // 자바 프로세스가 종료되면 Node.js도 종료
    });
}

function sendDataAndReceiveOutput(javaProcess, inputData) {
    return new Promise((resolve) => {
        javaProcess.stdout.once('data', (data) => {
            const output = data.toString('utf-8');
            resolve(output);
        });

        javaProcess.stdin.write(inputData + '\n');
    });
}

function getRandomNumber() {
    // 현재 시간을 이용하여 시드값 생성
    const seed = new Date().getTime();

    // 시드값을 기반으로 1부터 1017 사이의 랜덤한 정수 생성
    return Math.floor(Math.random() * 1017) + 1;
}