
class M3u8Download{
    constructor(){
        const readlineSync = require('readline-sync');
        let url = readlineSync.question('please input a m3u8 href:');
        let str = '1000kb/hls/index.m3u8';
        url = url.split('/');
        url.pop();
        url.push(str);
        this.oldUrl = url.join('/');
        this.downloadM3u8();
        // this.m3u8Parse()
    }
    /**
     * 下载m3u8文件
     */
    downloadM3u8(){
        const https = require('https');
        const fs = require('fs');
        let ws = fs.createWriteStream('./index.m3u8');
        https.get(this.oldUrl, (res) => {
            res.pipe(ws);
            res.on('end', () => {
                console.log('m3u8下载完成');
                console.log('资源解析中...............');
                this.m3u8Parse();
            });
        });
    }
    /**
     * 解析m3u8文件
     */
    m3u8Parse(){
        const fs = require('fs');
        let str = fs.readFileSync('./index.m3u8',{encoding:'utf-8'});
        this.toBeDownLoad = str.split('\n');
        this.toBeDownLoad = this.toBeDownLoad.filter((item) => item.includes('.ts'));
        console.log('资源解析完成');
        let url = this.oldUrl.split('/');
        url.pop();
        this.url = url.join('/');
        console.log('正在生成资源链接..............');
        this.generateSrc();
    }
    generateSrc(){
        let i = 0;
        this.downloadList = new Map();
        for (const iterator of this.toBeDownLoad) {
            this.downloadList.set(`${i}.ts`, `${this.url}/${iterator}`);
            i++;
        }
        console.log('资源生成完毕');
        console.log('开始下载');
        this.start();
    }
    start(){
        const fs = require('fs');
        const https = require('https');
        let i = 1;
        let all = Array.from(this.downloadList.keys()).length;
        let done = 0;
        for (let item of this.downloadList.entries()) {
            setTimeout(() => {
                let ws = fs.createWriteStream(`./temp/${item[0]}`);
                let req = https.get(item[1], (res) =>{
                    res.pipe(ws);
                    res.on('end', () => {
                        done++;
                        console.log(item[0] + '下载完成');
                        let progress = (done/all)*100;
                        console.log(`进度：${progress.toFixed(2)}%`);
                    });
                });
                req.on('error', function(e) { 
                    console.log('problem with request: ' + e.message); 
                }); 
                req.end();
            }, 1000*i);
            i++;
        }
    }
}

let d = new M3u8Download();