const fs = require('fs');

let org = '../000/mzxj';

let target = '../000/test';


let src = `${org}/index.m3u8`;


const arr = {};

let res = fs.readFileSync(src, {encoding: 'utf-8'});
res = res.split('\r\n');

for (let i = 0; i < res.length; i++) {
    arr[`${target}/${i}.ts`] = `${org}/${res[i]}`;
}
for (const key in arr) {
    let ws = fs.createWriteStream(key);
    let rs = fs.createReadStream(arr[key]);
    rs.pipe(ws);
}