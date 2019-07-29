const mysql = require('mysql');
var express = require('express');
var app = express();
const bodyparser = require('body-parser');
app.use(bodyparser.json());

var mysqlConn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Open1234',
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

app.listen(3000, () =>console.log(`App is running on port 3000`));

//GET ALL EMPLOYEES
app.get('/employees' , (req, res) =>{
    mysqlConn.query('SELECT * FROM EMPLOYEE', (err, rows, fields)=>{
        if(!err){
            console.log( rows);
            res.send(rows);
        }        
        else
        console.log(err);
    });
});

//GET ALL EMPLOYEES/1
app.get('/employees/:id' , (req, res) =>{
    mysqlConn.query('SELECT * FROM EMPLOYEE WHERE ID_EMP = ?', [req.params.id], (err, rows, fields)=>{
        if(!err){
            console.log( rows);
            res.send(rows);
        }        
        else
        console.log(err);
    });
});

//DELETE  EMPLOYEES/1
app.delete('/employees/:id' , (req, res) =>{
    mysqlConn.query('DELETE FROM EMPLOYEE WHERE ID_EMP = ?', [req.params.id], (err, rows, fields)=>{
        if(!err){
            console.log( rows);
            res.send(rows);
        }        
        else
        console.log(err);
    });
});

//Insert an employees
app.post('/employees', (req, res) => {
    let emp = req.body;
    var sql = "SET @ID_EMP = ?;SET @NAME = ?;SET @EMP_CODE  = ?;SET @SALARY = ?; \
    CALL EmployeeAddOrEdit(@ID_EMP ,@NAME ,@EMP_CODE ,@SALARY);";
    mysqlConn.query(sql, [emp.ID_EMP, emp.NAME, emp.EMP_CODE , emp.SALARY], (err, rows, fields) => {
        if (!err)
            rows.forEach(element => {
                if(element.constructor == Array)
                res.send('Inserted employee id : '+element[0].ID_EMP);
            });
        else
            console.log(err);
    })
});

//Update an employees
app.put('/employees', (req, res) => {
    let emp = req.body;
    var sql = "SET @ID_EMP = ?;SET @NAME = ?;SET @EMP_CODE  = ?;SET @SALARY = ?; \
    CALL EmployeeAddOrEdit(@ID_EMP ,@NAME ,@EMP_CODE ,@SALARY);";
    mysqlConn.query(sql, [emp.ID_EMP, emp.NAME, emp.EMP_CODE , emp.SALARY], (err, rows, fields) => {
        if (!err)
            res.send('Updated successfully');
        else
            console.log(err);
    })
});