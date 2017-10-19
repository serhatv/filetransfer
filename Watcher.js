const fs = require('fs');
const path = require('path');

function Watcher(folderToWatch, folderToTransfer) {
  this.folderToWatch = folderToWatch;
  this.folderToTransfer = folderToTransfer;
  this.watcherObj = null;
}

Watcher.prototype.begin = function () {
  if (this.watcherObj === null) {
    console.log("watcher is started");
    this.watcherObj = fs.watch(this.folderToWatch, (eventType, filename)=> {
      console.log("change detected");
      fs.stat(path.resolve(this.folderToWatch, filename), (err, stats)=>{
        if (stats === undefined) {
          this.delete(filename);
        } else {
          this.transfer(filename);
        }
      })
    });
  } else {
    console.log("watcher is already running");
  }
}
Watcher.prototype.close = function () {
  if (this.watcherObj !== null) {
    this.watcherObj.close();
    this.watcherObj = null;
    console.log("watcher is closed");
  } else {
    console.log("watcher is already closed");
  }
}

Watcher.prototype.delete = function (filename) {
  fs.unlink(path.resolve(this.folderToTransfer, filename), (err)=> {
    console.log(filename, "deleted");
  })
}

Watcher.prototype.transfer = function (filename) {
  var that = this;
  var readStream = fs.createReadStream(path.resolve(this.folderToWatch, filename));

  var fileRead = Buffer.alloc(10);

  readStream.on('open', ()=> {
    console.log("stream opened");
  });
  readStream.on('data', (data)=>{
    fileRead += data;
  });
  readStream.on('end', ()=>{
    console.log("file has been read");
    writeFile(filename);
    readStream.close();
  });

  function writeFile(filename) {
    var writeStream = fs.createWriteStream(path.resolve(that.folderToTransfer, filename));

    writeStream.on('open', ()=> {
      console.log("writing started");
    });

    writeStream.write(fileRead);
    writeStream.end('', ()=>{
      console.log("writing finished");
    });
  }
}

module.exports = Watcher;
