const path = require('path');
const rootDir = require('../util/path');

exports.error404 = (req, res, next)=>{
  res.sendFile(path.join(rootDir,"views","404Page.html"))
}