import net from 'net';
import fs from 'node:fs/promises';

const socket = net.createConnection({host: "127.0.0.1", port: 4080},async ()=>{
    const filePath = "./upload.txt";
    const fileHandle = await fs.open(filePath,"r");
    const fileStream = fileHandle.createReadStream();

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