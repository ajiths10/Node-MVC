const path = require('path');
const rootDir = require('../util/path');

exports.contactusGet = (req, res , next)=> {   
    res.sendFile(path.join(rootDir,'views','contactus.html'))
}


exports.contactusPost = (req, res , next)=> {
    console.log(req.body)
    res.sendFile(path.join(rootDir, 'views' , 'success.html'))
}

