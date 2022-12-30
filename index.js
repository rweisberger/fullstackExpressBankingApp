
require('dotenv').config();
console.log(process.env);
const express = require('express');
const app     = express();
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const cors    = require('cors');
const dal     = require('./dal.js');
// const e = require('express');

// used to serve static files from public directory
app.use(express.static('public'));

app.use(cors());

// create user account
app.post('/account/create', function (req, res) {
    console.log('request',req);
    // check if account exists
    dal.find(req.body.email)
        .then((users) => {

            // if user exists, return error message
            if(users.length > 0){
                console.log('User already exists');
                res.send('User already exists');    
            }
            else{
                // else create user
                dal.create(req.body.accountNumber, req.body.name, req.body.email, req.body.password, req.body.isAdmin).
                    then((user) => {
                        console.log(user);
                        res.send(user);            
                    });            
            }
        });
});

// login user 
app.get('/account/login/:email/:password', function (req, res) {

    dal.find(req.params.email)
        .then((user) => {
            // success case, when promise is resolved

            // // if user exists, check password
            if(user.length > 0){
                if (user[0].password === req.params.password){
                    res.send(user[0]);
                }
                else{
                    res.send('Login failed: wrong password');
                }
            }
            else{
                res.send('Login failed: user not found');
            }
        // trying to learn more about error handling- what happens to the errors in the dal functions?
        // }, (error) => { 
        //     //  failure, when promise is rejected
        //     console.log(error)
        });   
});

// find user account
app.get('/account/find/:email', function (req, res) {

    dal.find(req.params.email).
        then((user) => {
            console.log(user);
            res.send(user);
    });
});

// find one user by email - alternative to find
app.get('/account/findOne/:email', function (req, res) {

    dal.findOne(req.params.email).
        then((user) => {
            console.log(user);
            res.send(user);
    });
});

// update - deposit/withdraw amount
app.get('/account/update/:email/:amount/:balance', function (req, res) {

    var amount = Number(req.params.amount);

    console.log('attempt to update. Amount: ', amount);

    dal.update(req.params.email, amount, req.params.balance).
        then((response) => {
            console.log(response, amount);
            res.send(response);
    });    
});

// all accounts
app.get('/account/all', function (req, res) {

    dal.all().
        then((docs) => {
            console.log(docs);
            res.send(docs);
    });
});

// delete account
app.delete('/account/delete/:email/:password', function(req, res) {

    dal.deleteAccount(req.params.email, req.params.password).
        then((doc) => {
            console.log(doc);
            res.send(doc);
        })
})

var port = process.env.PORT || 5000;
app.listen(port, () => console.log('Running on port: ' + port));