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
            fileHandle = await fs.open('./storage/uploaded.txt',"w");
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
        fileHandle.close();
        fileHandle = undefined;
        fileStream = undefined;
    })
});

server.listen(4080, "127.0.0.1", ()=>{
    console.log("Upload Server running at", server.address());
})
