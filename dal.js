const MongoClient = require('mongodb').MongoClient;

// const url = 'mongodb+srv://admin:QgqSlQ936zLbxJ3Z@cluster0.zhfaa.mongodb.net/?retryWrites=true&w=majority';
// let db;
// let collection;

// MongoClient.connect(url, function(err, database) {
//     console.log("successfully connected to database")
//     if(err) return console.error(err);
  
//     db = database;
//     collection = db.collection("users");

  
//     // the Mongo driver recommends starting the server here 
//     // because most apps *should* fail to start if they have no DB.
//     // If yours is the exception, move the server startup elsewhere. 
//   });
  
const url =
'mongodb+srv://admin:QgqSlQ936zLbxJ3Z@cluster0.zhfaa.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(url);
const dbName = "bank_project";
let db;
let collection;
async function main() {
  // Use connect method to connect to the server
  await client.connect();
  console.log("Connected successfully to server");
  db = client.db(dbName);
  collection = db.collection("users");
}

main()
  .then(console.log)
  .catch(console.error);

// create user account using the collection.insertOne function
function create(accountNumber, name, email, password, isAdmin) {
    return new Promise((resolve, reject) => {
        const collection = db.collection('users');
        const example = {
            name
        };
        const doc = {accountNumber, name, email, password, isAdmin, balance: 0, transactionHistory: []}
        collection.insertOne(doc, {w:1}, function(err, result) {
            err ? reject(err) : resolve(doc);
        });
    })
}

// find user account 
function find(email) {
    return new Promise((resolve, reject) => {
        const customers = db
            .collection('users')
            .find({ email: email })
            .toArray(function (err, docs) {
                err ? reject(err) : resolve(docs);
            });
    })
}

// find user account
function findOne(email) {
    return new Promise((resolve, reject) => {
        const customers = db
            .collection('users')
            .findOne({ email: email })
            .then((doc) => resolve(doc))
            .catch((err) => reject(err));
    })
}
    
// update - deposit/withdraw amount
function update(email, amount, balance) {
    return new Promise((resolve, reject) => {
        const customers = db
            .collection('users')
            .findOneAndUpdate(
                { email: email },
                { $inc: { balance: amount }, $push: {
                    transactionHistory:  
                            {
                                "date" : Date(), 
                                "change" : `${amount}`,
                                'balance': balance
                            }, 
                    }},
                { returnOriginal: false },
                function (err, documents) {
                    err ? reject(err) : resolve(documents);
                }
            );
    });
}

// return all users by using the collection.find method
function all() {
    return new Promise((resolve, reject) => {
        const customers = db
            .collection('users')
            .find({})
            .toArray(function(err, docs) {
                err ? reject(err) : resolve(docs);
            });
    })
}

// delete use account
function deleteAccount(email, password){
    return new Promise((resolve, reject) => {
        const collection = db.collection('users');
        const query = {
            email: email,
            password: password
        }
        collection.deleteOne(query)
            .then((doc) => resolve(doc))
            .catch((err) => reject(err));
        console.log("account deleted");
    })
}


module.exports = { create, findOne, find, update, all, deleteAccount };