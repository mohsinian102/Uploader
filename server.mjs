import net from 'net';
import fs from 'node:fs/promises';

const server = net.createServer(()=>{

});

let fileHandle, fileStream;

server.on('connection', (socket)=>{
    console.log("new connection");
    socket.on('data', async (data) => {
        if(!fileHandle) {
            socket.pause();
            const fileNameEnd = data.indexOf('---');
            const fileName = data.subarray(11,fileNameEnd).toString('utf-8');
            data = data.subarray(fileNameEnd+3);
            fileHandle = await fs.open(`./storage/${fileName}`,"w");
            fileStream = fileHandle.createWriteStream();
            fileStream.write(data);
            socket.resume();
            fileStream.on('drain',()=>{
                socket.resume();
            })
        }
        else {
            if(!fileStream.write(data)) {
                socket.pause();
            }
        }
    });
    socket.on("end", ()=>{
        console.log("File uploaded successfully!");
        console.log("Closing the Connection");
        if(fileHandle) {
            fileHandle.close();
        }
        fileHandle = undefined;
        fileStream = undefined;
    })
});

server.listen(4080, "127.0.0.1", ()=>{
    console.log("Upload Server running at", server.address());
})
