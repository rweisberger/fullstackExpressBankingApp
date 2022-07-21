const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
// const url = 'mongodb+srv://admin:<QgqSlQ936zLbxJ3Z>@cluster0.zhfaa.mongodb.net/?retryWrites=true&w=majority';
let db = null;

// connect to mongo
MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
    console.log("Connected successfully to db server");

    // connect to myproject database
    db = client.db('myproject');
});

// create user account using the collection.insertOne function
function create(name, email, password, isAdmin) {
    return new Promise((resolve, reject) => {
        const collection = db.collection('users');
        const example = {
            name
        };
        const doc = {name, email, password, isAdmin, balance: 0, transactionHistory: []}
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