import * as fs from 'node:fs/promises';

(async () => {
    console.time("writeMany");
    const fileHandle = await fs.open("upload.txt","w");

    const stream  = fileHandle.createWriteStream();
    let i = 0;
    const writeMany = () => {
        while(i < 500e6) {
            const buff = Buffer.from(` ${i}`, "utf-8");
            if(i==499999999) return stream.end(buff);
            if(!stream.write(buff)) break;
            i++;
        }
    }


    stream.on('drain',()=> {
        writeMany();
    })

    writeMany();

    stream.on('finish', ()=> {
        console.timeEnd("writeMany");
        fileHandle.close();
    })
}) ();