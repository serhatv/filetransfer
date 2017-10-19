const Watcher = require('./Watcher');
var folderToWatch = "./folderToWatch";
var folderToTransfer = "./folderToTransfer";

var w1 = new Watcher("/Users/macbookpro/Desktop", folderToTransfer);

w1.begin();
