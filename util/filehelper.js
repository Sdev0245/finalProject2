const fs  = require('fs');

const deleteFile = (imageUrl)=>{
    fs.unlink(imageUrl,(err)=>{
        if(err)
          return next(new Error('Has the error'));
    })
}
module.exports = {

   deleteFile 
};