const mysql = require('mysql');
//const User = require('../models/user');

class DB{

  constructor(){
    this.con = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    });

//    this.con.connect();
    this.con.connect((err) => {
      if(err){
        console.log(err);
      }else{
        console.log('Db Conect!');
      }
    });
  }

  getAll(table){
    return new Promise((resolve, reject) => {
      this.con.query('SELECT * FROM ??', [table], (error, results) => {
        if (error) return reject(this.processError(error));
        return resolve(results);
    });
   });
  }

  get(table, id) {
    return new Promise((resolve, reject) => {
      this.con.query('SELECT * FROM ?? WHERE id = ?', [table, id], (error, results) => {
        if (error) return reject(this.processError(error));
        console.log("db-get",results);
        return resolve(results);
      });
    });
  }

  delete(table, id) {
    return new Promise((resolve, reject) => {
      this.con.query('DELETE FROM ?? WHERE id = ?', [table, id], (error, results) => {
        if (error) {
            //error de la base de datos como mail repetido...
          let err = this.processError(error);
          return reject(err);
        }

        //console.log("db-delete",results);
        return resolve(results);
      });
    });
  }

  update(table, obj, id) {
    return new Promise((resolve, reject) => {
      this.con.query('UPDATE ?? SET ? WHERE id = ?', [table, obj, id], (error, results) => {
        if (error) {
          let err = this.processError(error);
          return reject(err);
        }
        //console.log("rows--update", results);
        resolve(results);
      //  console.log(results);
      });
    });
  }

  insert(table, resource) {
    //console.log("Resourse Db Insert: ",resource); //{ name: juan, mobile: 21421, }
    return new Promise((resolve, reject) => {
      this.con.query('INSERT INTO ?? SET ?', [table, resource], (error, results) => {
        if (error) {
            //error de la base de datos como mail repetido...
          //console.log("Insert DB Error: ", error);
          let err = this.processError(error);
          return reject(err);
        }
        return resolve(results);
      });
    });
  }

  processError(err) {
    //console.log("soy error");
    const error = {};

    switch (err.code) {
      case 'ER_DUP_ENTRY':
        let data = this.getDataFromErrorMsg(err.sqlMessage);
        error['duplicated'] = {
          message: `The ${data.field} ${data.data} already exists on the system`,
          field: data.field,
          sql: err.sql,
        };
        break;
        case 'ER_NO_REFERENCED_ROW_2':
          let dataa = this.getDataFromErrorMsg(err.sqlMessage);
          error['duplicated'] = {
            message: `The ${dataa.field} ${dataa.data} already exists on the system`,
            field: dataa.field,
            sql: err.sql,
          };
        break;
      default:

    }

    return error;
  }

  getDataFromErrorMsg(message) {
    let data = unescape(message).match(/'([^']+)'/g);
    return {
      field: data[1].slice(1,-1),
      data: data[0].slice(1,-1),
    }
  }



}

module.exports = new DB(); //singleton
