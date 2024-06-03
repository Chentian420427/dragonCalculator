'use strict';

const { Service } = require('ee-core');
const Storage = require('ee-core/storage');
const _ = require('lodash');
const path = require('path');

/**
 * sqlite数据存储
 * @class
 */
class SqlitedbService extends Service {

  constructor(ctx) {
    super(ctx);

    this.sqliteFile = 'sqlite-demo.db';
    let sqliteOptions = {
      driver: 'sqlite',
      default: {
        timeout: 6000,
        verbose: console.log // 打印sql语法
      }
    }
    this.demoSqliteDB = Storage.connection(this.sqliteFile, sqliteOptions);
  }

  /*
   * 检查并创建表 (sqlite)
   */
  async checkAndCreateTableSqlite(tableName = '') {
    if (_.isEmpty(tableName)) {
      throw new Error(`table name is required`);
    }
    // 检查表是否存在
    const userTable = this.demoSqliteDB.db.prepare('SELECT * FROM sqlite_master WHERE type=? AND name = ?');
    const result = userTable.get('table', tableName);
    //console.log('result:', result);
    if (result) {
      return;
    }

    // 创建表
    const create_table_user =
      `CREATE TABLE ${tableName}
     (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name CHAR(50) NOT NULL,
        age INT
     );`
    this.demoSqliteDB.db.exec(create_table_user);

  }

  /*
   * 检查并创建表 (ball,ball_sum表)
   */
  async checkAndCreateTable(t) {

    // 检查表是否存在
    const userTable = this.demoSqliteDB.db.prepare('SELECT * FROM sqlite_master WHERE type=?');
    const result = userTable.all('table');
    
    if (result) {
      if(!result.find(item => item.name === 'ball')) {
        // 创建表
        const create_table_ball =
        `CREATE TABLE ball (
          ball_num INTEGER,
          color TEXT,
          ball_type INTEGER,
          zodiac TEXT,
          CONSTRAINT ball_PK PRIMARY KEY (ball_num)
          );`
      this.demoSqliteDB.db.exec(create_table_ball);
      }
      if(!result.find(item => item.name === 'ball_sum')) {
        const create_table_ball_sum =
        `CREATE TABLE ball_sum (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ball_num INTEGER,
        amount NUMERIC
      , period INTEGER);`
        this.demoSqliteDB.db.exec(create_table_ball_sum);
      }
      
    } 


  }


  /**
   * 查询号码的总数
   * @returns 
   */
  async querySumByBallNumAndPeriod(period = 0, ballNumStr = '') {
    await this.checkAndCreateTable();

    const selectAllBallSum = this.demoSqliteDB.db.prepare(`
      SELECT
      ball_num,
      period ,
      SUM(amount) as sum
    FROM
      ball_sum
    WHERE
      period = @period AND ball_num in (${ballNumStr})
    group by
      ball_num ,
      period`);
    const datas = selectAllBallSum.all({ period: period });
    //console.log("select users:", users);
    return datas;
  }

  /**
   * 查询所有号码信息
   * @returns 
   */
  async queryAllBall() {
    await this.checkAndCreateTable();

    const selectAllBallSum = this.demoSqliteDB.db.prepare(`SELECT * FROM ball`);
    const datas = selectAllBallSum.all();
    //  console.log("select users:", datas);
    return datas;
  }

  /**
   * 查询指定号码的详情
   * @returns 
   */
  async queryDetailByNum(ballDTO) {
    await this.checkAndCreateTable();

    const selectAllBallSum = this.demoSqliteDB.db.prepare(`SELECT * FROM ball_sum where ball_num=@ballNum and period=@period`);
    const datas = selectAllBallSum.all(ballDTO);
    //  console.log("select users:", datas);
    return datas;
  }

  /**
   * 根据生肖查询号码
   * @returns 
   */
  async queryBallByZodiac(zodiac = '') {
    await this.checkAndCreateTable();

    const selectAllBallSum = this.demoSqliteDB.db.prepare(`SELECT * FROM ball where zodiac=@zodiac`);
    const datas = selectAllBallSum.all(zodiac);
    //console.log("select users:", users);
    return datas;
  }

  /**
   * 根据类型查询号码
   * @returns 
   */
  async queryBallByBallType(ball_type = '') {
    await this.checkAndCreateTable();

    const selectAllBallSum = this.demoSqliteDB.db.prepare(`SELECT * FROM ball where ball_type=@ball_type`);
    const datas = selectAllBallSum.all(ball_type);
    //console.log("select users:", users);
    return datas;
  }

  /**
   * 删除指定期数数据
   * @returns 
   */
  async deleteByPeriod(period = '') {
    await this.checkAndCreateTable();
    console.log(period)
    const deleteOperation = this.demoSqliteDB.db.prepare(`DELETE FROM ball_sum where period=?`);
    deleteOperation.run(period);
    //console.log("select users:", users);
    return true;
  }

  /**
   * 操作加减
   * @returns 
   */
  async operationAmount(ballDTO) {
    await this.checkAndCreateTable();
    const insert = this.demoSqliteDB.db.prepare(`INSERT INTO ball_sum (ball_num, amount, period) VALUES (@ballNum, @amount, @period)`);
    insert.run(ballDTO);
    //console.log("select users:", users);
    return true;
  }

  /*
   * 增 Test data (sqlite)
   */
  async addTestDataSqlite(data) {
    //console.log("add data:", data);

    let table = 'user';
    await this.checkAndCreateTableSqlite(table);

    const insert = this.demoSqliteDB.db.prepare(`INSERT INTO ${table} (name, age) VALUES (@name, @age)`);
    insert.run(data);

    return true;
  }

  /*
   * 删 Test data (sqlite)
   */
  async delTestDataSqlite(name = '') {
    //console.log("delete name:", name);

    let table = 'user';
    await this.checkAndCreateTableSqlite(table);

    const delUser = this.demoSqliteDB.db.prepare(`DELETE FROM ${table} WHERE name = ?`);
    delUser.run(name);

    return true;
  }

  /*
   * 改 Test data (sqlite)
   */
  async updateTestDataSqlite(name = '', age = 0) {
    //console.log("update :", {name, age});

    let table = 'user';
    await this.checkAndCreateTableSqlite(table);

    const updateUser = this.demoSqliteDB.db.prepare(`UPDATE ${table} SET age = ? WHERE name = ?`);
    updateUser.run(age, name);

    return true;
  }

  /*
   * 查 Test data (sqlite)
   */
  async getTestDataSqlite(age = 0) {
    //console.log("select :", {age});

    let table = 'user';
    await this.checkAndCreateTableSqlite(table);

    const selectUser = this.demoSqliteDB.db.prepare(`SELECT * FROM ${table} WHERE age = @age`);
    const users = selectUser.all({ age: age });
    //console.log("select users:", users);
    return users;
  }

  /*
   * all Test data (sqlite)
   */
  async getAllTestDataSqlite() {
    //console.log("select all user");

    let table = 'user';
    await this.checkAndCreateTableSqlite(table);

    const selectAllUser = this.demoSqliteDB.db.prepare(`SELECT * FROM ${table} `);
    const allUser = selectAllUser.all();
    //console.log("select allUser:", allUser);
    return allUser;
  }

  /*
   * get data dir (sqlite)
   */
  async getDataDir() {
    const dir = this.demoSqliteDB.getStorageDir();

    return dir;
  }

  /*
   * set custom data dir (sqlite)
   */
  async setCustomDataDir(dir) {
    if (_.isEmpty(dir)) {
      return;
    }

    // the absolute path of the db file
    const dbFile = path.join(dir, this.sqliteFile);
    const sqliteOptions = {
      driver: 'sqlite',
      default: {
        timeout: 6000,
        verbose: console.log
      }
    }
    this.demoSqliteDB = Storage.connection(dbFile, sqliteOptions);

    return;
  }
}

SqlitedbService.toString = () => '[class SqlitedbService]';
module.exports = SqlitedbService;
