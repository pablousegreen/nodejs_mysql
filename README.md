# nodejs_mysql
NODEJS_MYSQL_BASIC_CONECTION

npm init
npm install --save express@4.17.1 mysql@2.17.1 body-parser@1.19.0
npm install -g nodemon
nodemon index.js


//STORE PROCEDURE
CREATE DEFINER=`root`@`localhost` PROCEDURE `EmployeeAddOrEdit`(
IN _ID_EMP INT,
IN _NAME VARCHAR(45),
IN _EMP_CODE VARCHAR(45),
IN _SALARY INT
)
BEGIN
	IF _ID_EMP = 0 THEN
		INSERT INTO EMPLOYEE (NAME, EMP_CODE, SALARY)
        VALUES (_NAME, _EMP_CODE, _SALARY);
        
        SET _ID_EMP = last_insert_id();
	ELSE
		UPDATE EMPLOYEE
		SET
        NAME = _NAME,
        EMP_CODE = _EMP_CODE,
        SALARY = _SALARY
		WHERE ID_EMP = _ID_EMP;
	END IF;
    
    SELECT _ID_EMP AS 'ID_EMP';

END
