import net from 'net';
import fs from 'node:fs/promises';

const server = net.createServer(()=>{

});

server.on('connection', (socket)=>{
    console.log("new connection");
    socket.on('data', async (data) => {
        const fileHandle = await fs.open('./storage/uploaded.txt',"w");
        const fileStream = fileHandle.createWriteStream();
        fileStream.write(data);
    })
});

server.listen(4080, "127.0.0.1", ()=>{
    console.log("Upload Server running at", server.address());
})
