const mysql = require('mysql');
var express = require('express');
var app = express();
const bodyparser = require('body-parser');
app.use(bodyparser.json());

var mysqlConn = mysql.createConnection({
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