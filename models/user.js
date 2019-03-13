// const Sequelize = require('sequelize');
// const sequelize  =require('../util/database');
// const user = sequelize.define('user',{
//   id:{
//       type:Sequelize.INTEGER,
//       primaryKey:true, 
//       autoIncrement:true   
//   },
//   name:{
//       type:Sequelize.STRING
//   },
//   email:{
//       type:Sequelize.STRING
//   }
// });
const getDb = require('../util/database').getDb;
const mongodb =require('mongodb'); 

class User{
    constructor(username,email,cart,id)
    {
        this.username= username;
        this.email= email;

        this.cart =cart;
        this._id =id;
    }

    
    addToCart(product) {
        const cartProductIndex = this.cart.items.findIndex(cp => {
          return cp.productId.toString() === product._id.toString();
        });
        let newQuantity = 1;
        const updatedCartItems = [...this.cart.items];
    
        if (cartProductIndex >= 0) {
          newQuantity = this.cart.items[cartProductIndex].quantity + 1;
          updatedCartItems[cartProductIndex].quantity = newQuantity;
        } else {
          updatedCartItems.push({
            productId: new mongodb.ObjectId(product._id),
            quantity: newQuantity
          });
        }
        const updatedCart = {
          items: updatedCartItems
        };
        const db = getDb();
        return db
          .collection('user')
          .updateOne(
            { _id: new mongodb.ObjectId(this._id) },
            { $set: { cart: updatedCart } }
          );
      }
    getCart() {
        const db = getDb();
        const productIds = this.cart.items.map(i => {
          return i.productId;
        });
        return db
          .collection('product')
          .find({ _id: { $in: productIds } })
          .toArray()
          .then(products => {
            return products.map(p => {
              return {
                ...p,
                quantity: this.cart.items.find(i => {
                  return i.productId.toString() === p._id.toString();
                }).quantity
              };
            });
          });
      }
    
   deleteItem(prodId)
   {
       const updatedItems  =  this.cart.items.filter(products=>{
                  return products.productId.toString() !== prodId.toString();
       });
       
       const db = getDb();
       return db.collection('user').updateOne({_id:new mongodb.ObjectId(this._id)},{
           $set:{
               cart:{
                   items:updatedItems
               }
           }
       })
   }
   getOrders()
   {
       const db =getDb();
   return db.collection('order').find({'user._id':new mongodb.ObjectId(this._id)}).toArray();
    
   }
   addOrder() {
    const db = getDb();
    return this.getCart()
      .then(products => {
        const order = {
          items: products,
          user: {
            _id: new mongodb.ObjectId(this._id),
            name: this.name
          }
        };
        return db.collection('order').insertOne(order);
      })
      .then(result => {
        this.cart = { items: [] };
        return db
          .collection('user')
          .updateOne(
            { _id: new mongodb.ObjectId(this._id) },
            { $set: { cart: { items: [] } } }
          );
      });


  }
  deleteOrder(orderId)
  {
    const db = getDb(); 
return db.collection('order').deleteOne({_id:new mongodb.ObjectId(orderId)}).then(values=>{
  console.log(values);
})


      
   
 
   
 
}

    save(){

        const db = getDb();
        return db.collection('user').insertOne(this);

    }
    

    static findById(prodId)
    {

        const db =getDb();
        return db.collection('user').find({_id:new mongodb.ObjectId(prodId)}).next();

    }
    
};


 module.exports = User