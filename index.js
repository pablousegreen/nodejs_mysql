const mysql = require('mysql');
//class
const Openpay = require('openpay');
const express = require('express');
const request = require('request');
var app = express();
const bodyparser = require('body-parser');

app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

let mysqlConn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    //password: 'Open1234',
    password: '1234',
    database: 'develop_db',
    multipleStatements: true
});

mysqlConn.connect(err=>{
    if(!err){
        console.log('DB connection Succeded');      
    }
    else{
        console.log(`DB connection failed ${JSON.stringify(err, undefined, 2)}`);
    }
});

app.use(function(req, res, next) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
  
  });

app.listen(3000, () =>console.log(`App is running on port 3000`));

//basic reponse html file
app.get('/', (req, res)=>{
    res.sendFile(__dirname +'/index.html');
});

//GET ALL EMPLOYEES
app.get('/employees' , (req, res) =>{
    mysqlConn.query('SELECT ID_EMP AS id, NAME AS name, EMP_CODE as code, SALARY AS salary FROM EMPLOYEE', (err, rows, fields)=>{
        if(!err){
            console.log( rows);
            res.status(200).send(rows);
        }        
        else{
            es.status(400).send('Errror ', err);
        }
        
    });
});

//GET ALL EMPLOYEES/1
app.get('/employees/:id' , (req, res) =>{
    mysqlConn.query('SELECT ID_EMP AS id, NAME AS name, EMP_CODE as code, SALARY AS salary FROM EMPLOYEE WHERE ID_EMP = ?', [req.params.id], (err, rows, fields)=>{
        if(!err){
            console.log( rows);
            res.status(200).send(rows);
        }        
        else{
            console.log(err);
            res.status(400).send(rows);
        }
    });
});

//DELETE  EMPLOYEES/1
app.delete('/employees/:id' , (req, res) =>{
    console.log('delete: ', req.params.id);
    mysqlConn.query('DELETE FROM EMPLOYEE WHERE ID_EMP = ?', [req.params.id], (err, rows, fields)=>{
        if(!err){
            console.log( rows);
            res.status(200).send(rows);
        }        
        else{
            console.log(err);
            res.status(400).send('Errror ', err);
        }
    });
});

//Insert an employees
app.post('/employees', (req, res) => {
    let emp = req.body;
    console.log("Post: ", emp);
    var sql = "SET @ID_EMP = ?;SET @NAME = ?;SET @EMP_CODE  = ?;SET @SALARY = ?; \
    CALL EmployeeAddOrEdit(@ID_EMP ,@NAME ,@EMP_CODE ,@SALARY);";
    //mysqlConn.query(sql, [emp.ID_EMP, emp.NAME, emp.EMP_CODE , emp.SALARY], (err, rows, fields) => {
        mysqlConn.query(sql, [emp.id, emp.name, emp.code , emp.salary], (err, rows, fields) => {    
        if (!err){
            rows.forEach(element => {
                if(element.constructor === Array){
                    res.status(200).send('Inserted employee id : '+element[0].ID_EMP);
                    console.log(element[0].ID_EMP);
                }
            });
        }   
        else{
            console.log(err);
            res.status(400).send('Errror ', err);
        }
            
    })
});

//Update an employees
app.put('/employees', (req, res) => {
    let emp = req.body;
    console.log('PUT: ', emp);
    var sql = "SET @ID_EMP = ?;SET @NAME = ?;SET @EMP_CODE  = ?;SET @SALARY = ?; \
    CALL EmployeeAddOrEdit(@ID_EMP ,@NAME ,@EMP_CODE ,@SALARY);";
    //mysqlConn.query(sql, [emp.ID_EMP, emp.NAME, emp.EMP_CODE , emp.SALARY], (err, rows, fields) => {
        mysqlConn.query(sql, [emp.id, emp.name, emp.code , emp.salary], (err, rows, fields) => {    
        if (!err)
                res.status(200).send('Updated successfully');
            else{
                console.log(err);
                res.status(400).send('Errror ', err);
            }
    })
});


/***********OPENPAY TEST******** */

app.post('/create_customer', (req, res)=>{
    let newCustomer = req.body;
    console.log('WELL see new Customer: ', newCustomer);
    if(newCustomer === null){
        res.status(450).send('Customer Null');
    }
    //instantiation
    var openpay = new Openpay('mivwslqokin62ozwknpf', 'sk_1bffa42ba7224a25ba1a72cc80c35d43');
    openpay.setProductionReady(false);
    openpay.customers.create(newCustomer, function(error, body) {
        if(error!== null){
            res.status(455).send(error);
        }    // null if no error occurred (status code != 200||201||204)
        res.status(200).send(body);     // contains the object returned if no error occurred (status code == 200||201||204)
    });

});

app.post('/new_charge', (req, res)=>{
    let newCharge = req.body;
    console.log('WELL see new newCharge: ', newCharge);
    if(newCharge === null){
        res.status(450).send('Charge Null');
    }
    //instantiation
    var openpay = new Openpay('mivwslqokin62ozwknpf', 'sk_1bffa42ba7224a25ba1a72cc80c35d43');
    openpay.setProductionReady(false);
    openpay.charges.create(newCharge, function (error, body){
        if(error!== null){
            res.status(455).send(error);
        }    // null if no error occurred (status code != 200||201||204)
        res.status(200).send(body);     // contains the object returned if no error occurred (status code == 200||201||204)
      });
});

app.post('/payout', (req, res)=>{
    let payout = req.body;
    console.log('WELL see new payout: ', payout);
    if(payout === null){
        res.status(450).send('payout Null');
    }
    //instantiation
    var openpay = new Openpay('mivwslqokin62ozwknpf', 'sk_1bffa42ba7224a25ba1a72cc80c35d43');
    openpay.setProductionReady(false);
    openpay.payouts.create(payout, function (error, body){
        if(error!== null){
            res.status(455).send(error);
        }    // null if no error occurred (status code != 200||201||204)
        res.status(200).send(body);     // contains the object returned if no error occurred (status code == 200||201||204)
      });
});


app.post('/webhooks', (req, res)=>{
    let webhook_params = req.body;
    console.log('WELL see new webhooks: ', webhook_params);
    if(webhook_params === null){
        res.status(450).send('webhooks Null');
    }
    //instantiation
    var openpay = new Openpay('mivwslqokin62ozwknpf', 'sk_1bffa42ba7224a25ba1a72cc80c35d43');
    openpay.setProductionReady(false);
    openpay.webhooks.create(webhook_params, function (error, body, response){
        if(error!== null){
            res.status(455).send(error);
        }    // null if no error occurred (status code != 200||201||204)
        res.status(200).send(body);     // contains the object returned if no error occurred (status code == 200||201||204)
      });
});