//  const Sequelize  =require('sequelize');

//  const sequelize = require('../util/database');

//  const product = sequelize.define('product',{
//    id:{
//      type:Sequelize.INTEGER,
//      autoIncrement:true,
//      primaryKey :true
//    },
//    title:{
//     type:Sequelize.STRING,
//     allowNULL:false
//   },
//    price:{
//      type:Sequelize.INTEGER,
//      allowNULL:false
//    },
  
//    imageUrl:{
//      type:Sequelize.STRING,
//      allowNULL:false
//    },
// description:{
//   type:Sequelize.STRING
// }
//  });

//  module.exports =  product;


// const getDb = require('../util/database').getDb;
// const mongodb = require('mongodb');

// class Product{
 
//   constructor(title, price, imageUrl,  description,id, userId) {
//     this.title = title;
//     this.price = price;
//     this.description = description;
//     this.imageUrl = imageUrl;
//     this._id = id ? new mongodb.ObjectId(id) : null;
//     this.userId = userId;
//   }
// save() {
//   const db = getDb();
//   let dbOp;
//   if (this._id) {
//     // Update the product
//     dbOp = db
//       .collection('product')
//       .updateOne({ _id: this._id }, { $set: this });
//   } else {
//     dbOp = db.collection('product').insertOne(this);
//   }
//   return dbOp
//     .then(result => {
//       console.log(result);
//     })
//     .catch(err => {
//       console.log(err);
//     });
// }
     

// static fetchAll()
// {
//   const db = getDb();
//    return db.collection('product').find().toArray().then(values=>{
//      return values;
//      console.log(values);
//    }).catch(err=>{
//      console.log(err);
//    })
//   }
//   static findById(prodId)
//    {
//      const db = getDb();
//      return db.collection('product').find({_id:new mongodb.ObjectId(prodId)})
//      .next()
//      .then(product=>{
//       // console.log(product);
//             return product;
//      }).catch(err=>{
//        console.log(err);
//      })
//    }

//    static deleteById(prodId)
//    {
//      const db = getDb();

//      return db.collection('product').deleteOne({_id:new mongodb.ObjectId(prodId)}).then(item=>{
//        console.log(item);
//      }).catch(err=>{
//        console.log(err);
//      })
//    }

// }


// module.exports= Product;

const mongoose = require('mongoose');
const Schema  = mongoose.Schema;
const ProductSchema = new Schema({
    
    title:{
        type:String,
        required:true
    },

    price:{
        type:Number,
        required:true
    },
    imageUrl:{
        type:String,
    },
    description:{
        type:String,
        required:true
    },
    userId:{
            type:Schema.Types.ObjectId,
           ref :'users'
    }


});

module.exports = mongoose.model('product',ProductSchema);