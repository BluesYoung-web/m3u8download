const fs = require('fs');

const url = 'https://videozmcdn.stz8.com:8091/20191123/d871aAtt/1000kb/hls/';
const src = './index.m3u8';
let str = fs.readFileSync(src,{encoding:'utf-8'});
let arr = str.split('\n');
arr = arr.map((item) => {
    if (item.includes('.ts')) {
        item = `${url}${item}`;
    }
    return item;
});
let word = arr.join('\n');
fs.writeFileSync(src, word);