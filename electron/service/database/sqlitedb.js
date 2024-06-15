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
  async checkAndCreateTable() {

    // 检查表是否存在
    const userTable = this.demoSqliteDB.db.prepare('SELECT * FROM sqlite_master WHERE type=?');
    const result = userTable.all('table');

    if (result) {
      if (!result.find(item => item.name === 'ball')) {
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
        let insertSqlArr = ["INSERT INTO ball (ball_num,color,ball_type,zodiac) VALUES (1,'red',1,'龙'),(2,'red',2,'兔'),(3,'blue',1,'虎'),(4,'blue',2,'牛'),(5,'green',1,'鼠'),(6,'green',2,'猪'),(7,'red',1,'狗'),(8,'red',2,'鸡'),(9,'blue',1,'猴'),(10,'blue',2,'羊')",
          "INSERT INTO ball (ball_num,color,ball_type,zodiac) VALUES (11,'green',1,'马'),(12,'red',2,'蛇'),(13,'red',1,'龙'),(14,'blue',2,'兔'),(15,'blue',1,'虎'),(16,'green',2,'牛'),(17,'green',1,'鼠'),(18,'red',2,'猪'),(19,'red',1,'狗'),(20,'blue',2,'鸡')",
          "INSERT INTO ball (ball_num,color,ball_type,zodiac) VALUES (21,'green',1,'猴'),(22,'green',2,'羊'),(23,'red',1,'马'),(24,'red',2,'蛇'),(25,'blue',1,'龙'),(26,'blue',2,'兔'),(27,'green',1,'虎'),(28,'green',2,'牛'),(29,'red',1,'鼠'),(30,'red',2,'猪')",
          "INSERT INTO ball (ball_num,color,ball_type,zodiac) VALUES (31,'blue',1,'狗'),(32,'green',2,'鸡'),(33,'green',1,'猴'),(34,'red',2,'羊'),(35,'red',1,'马'),(36,'blue',2,'蛇'),(37,'blue',1,'龙'),(38,'green',2,'兔'),(39,'green',1,'虎'),(40,'red',2,'牛')",
          "INSERT INTO ball (ball_num,color,ball_type,zodiac) VALUES (41,'blue',1,'鼠'),(42,'blue',2,'猪'),(43,'green',1,'狗'),(44,'green',2,'鸡'),(45,'red',1,'猴'),(46,'red',2,'羊'),(47,'blue',1,'马'),(48,'blue',2,'蛇'),(49,'green',1,'龙')"];

        insertSqlArr.forEach(sql => {
          let insertInit = this.demoSqliteDB.db.prepare(sql);
          insertInit.run();
        })

      }
      if (!result.find(item => item.name === 'ball_sum')) {
        const create_table_ball_sum =
          `CREATE TABLE ball_sum (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ball_num INTEGER,
        amount NUMERIC
      , period INTEGER);`
        this.demoSqliteDB.db.exec(create_table_ball_sum);
      }
      if (!result.find(item => item.name === 'ball_history')) {
        const create_table_ball_history =
          `CREATE TABLE ball_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            "desc" TEXT,
            period INTEGER,
            create_time TEXT
          );`
        this.demoSqliteDB.db.exec(create_table_ball_history);
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
    const deleteHistory = this.demoSqliteDB.db.prepare(`DELETE FROM ball_history where period=?`);
    deleteHistory.run(period);
    //console.log("select users:", users);
    return true;
  }

  /**
   * 查询历史记录
   * @returns 
   */
  async queryHistory(period = '') {
    await this.checkAndCreateTable();
    console.log(period)
    const queryOperation = this.demoSqliteDB.db.prepare(`SELECT * FROM ball_history where period=? order by create_time desc`);
    const datas = queryOperation.all(period);
    //console.log("select users:", users);
    return datas;
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

  /**
   * 插入历史记录
   * @returns 
   */
  async insertHistory(ballDTO) {
    await this.checkAndCreateTable();
    const insert = this.demoSqliteDB.db.prepare(`INSERT INTO ball_history (desc, period, create_time) VALUES (@desc, @period, @create_time)`);
    insert.run(ballDTO);
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
