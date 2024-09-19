import net from 'net';
import fs from 'node:fs/promises';

const socket = net.createConnection({host: "127.0.0.1", port: 4080},async ()=>{
    const filePath = "./upload.txt";
    const fileHandle = await fs.open(filePath,"r");
    const fileStream = fileHandle.createReadStream();

    fileStream.on("data", (data)=> {
        socket.write(data);
    });

    fileStream.on("end",()=>{
        console.log("Connection Ended");
        socket.end();
    })
});