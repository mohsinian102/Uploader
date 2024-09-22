import net from 'net';
import fs from 'node:fs/promises';
import path from 'path';

const socket = net.createConnection({host: "127.0.0.1", port: 4080},async ()=>{
    const filePath = process.argv[2];
    const fileName = path.basename(filePath);
    const fileHandle = await fs.open(filePath,"r");
    const fileStream = fileHandle.createReadStream();

    // Sending our file name to the upload server
    socket.write(`File Name: ${fileName}---`)

    fileStream.on("data", (data)=> {
        if (!socket.write(data)) {
            fileStream.pause();
        }
    });

    socket.on('drain',()=> {
        fileStream.resume();
    })

    fileStream.on("end",()=>{
        socket.end();
    })
});