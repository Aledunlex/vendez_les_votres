const Items = require('../models/item.model').model;
const Users = require('../models/user.model').model;

const listMyItems =  async (req, res) => {
      const user = await Users.findById(req.userId);
      const allItems = await Items.find( {soldBy:user._id} );
      res.render('allitems',
                 {
                   title : "Vos annonces",
                   items : allItems,
                   myItems : true,
                   user : user
                 }
                );
}

const listOtherItems =  async (req, res) => {
  const user = await Users.findById( req.userId );
  const allItems = await Items.find( {soldBy: {$ne: user._id} } );
  res.render('allitems',
             {
               title : "Liste d'objets en vente",
               items : allItems,
               myItems : false,
               user : user
             }
            );
}

/* controller for path /items/one : find one item */
const oneItem =
  async (_, res) => {
    const foundItem = await Items.findOne();     // select first found document
    res.render('itemdetail',
              {
                title : 'Premier objet mis en vente',
                request : 'Items.findOne()',
                item : foundItem
              }) ;
  }

/* controller for /details/:itemId :  find items with _id= :itemId using findById() */
const details =
  async (req, res) => {
    const foundItem = await Items.findById( req.params.itemId );
    res.render('itemdetail',
                            {
                              title : 'Annonce retrouvée par identifiant',
                              request : 'Items.findById( req.params.itemId )',
                              item : foundItem
                            } );
  }

const buyItem = 
  async (req,res) => {
    try {
      const foundItem = await Items.findById( req.params.itemId );
      const buyer = await Users.findById( req.userId );
      const seller = await Users.findById( foundItem.soldBy );
      const itprice = foundItem.price;
      if(itprice <= buyer.money) {
        await Users.findByIdAndUpdate(buyer.id,
                                  { money: buyer.money - itprice },
                                  { new : true });
        await Users.findByIdAndUpdate(seller.id,
                                  { money: seller.money + itprice },
                                  { new : true });
        await Items.deleteOne( foundItem );
        console.log(`--> item ${foundItem.title} sold by ${seller.login} to ${buyer.login}`);
        res.status(200).redirect(303, '/items');
      }
      else
        res.status(401).redirect(303, '/items');
    }
    catch(error) {
      res.status(400).json(error);
    }
  }

/* controller for POST /create : execute the create operation in the db and return created item of successfull*/
const createItem =
 async (req, res, _) => {
   const newItemData = { ...req.body };
   try {
     const createdItem = await Items.create(newItemData);
     res.status(201).json(createdItem);
   }
   catch(error) {
     res.status(400).json(error);
   }
 }

  /*
  * deleting
  */
  const deleteItem =
    async (req,res) => {
      try {
        const item = await Items.findById( req.params.itemId );
        if(item.soldBy === req.userId) {
          await Items.deleteOne( {_id : req.params.itemId} );
          console.log(`--> item ${req.params.itemId} deleted`);
          res.status(201).redirect('/items/myitems');
        }
        else
          res.status(401).redirect('/items/myitems');
      }
      catch(error) {
        res.status(400).json(error);
      }
    }
  
 /* controller for GET /create : return the view with create form */
 const createForm =   (_,res) => res.render('createItem', { title: "Création d'une annonce" });

module.exports.listMyItems = listMyItems;
module.exports.listOtherItems = listOtherItems;
module.exports.oneItem = oneItem;
module.exports.details = details;
module.exports.create = createItem;
module.exports.createForm = createForm;
module.exports.buyItem = buyItem;
module.exports.delete = deleteItem;
