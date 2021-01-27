import { BasicRepository } from "./basic-repository";
import User from "./entities/user";
import Password from "./entities/password";
import { DatabaseConnectionError, NotFoundError } from "@pass-manager/common";
import { Pool, QueryResult } from "pg";

class PostgresRepository extends BasicRepository<any, any> {
  public client?: Pool;

  async connect() {
    if (
      !process.env.PGHOST ||
      !process.env.PGUSER ||
      !process.env.POSTGRES_PASSWORD ||
      !process.env.PGDATABASE ||
      !process.env.PGPORT
    ) {
      throw new Error("MongoDB parameters must be defined.");
    }

    const { Pool } = require("pg");
    this.client = new Pool({
      user: process.env.PGUSER,
      host: process.env.PGHOST,
      database: process.env.PGDATABASE,
      password: process.env.POSTGRES_PASSWORD,
      port: parseInt(process.env.PGPORT),
    });

    this.client!.on("connect", () => {
      console.log("Accessing postgres.");
    });
    this.client!.on("error", () => {
      console.log("Lost PG connection");
      throw new DatabaseConnectionError();
    });
  }

  async initializeDB() {
    await this.client!.query(
      `CREATE TABLE IF NOT EXISTS userrecord(
        id VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        version INT NOT NULL
      );`
    );

    await this.client!.query(
      `CREATE TABLE IF NOT EXISTS passwordrecord(
        id VARCHAR(255) PRIMARY KEY,
        userid VARCHAR(255) NOT NULL,
        domain VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        updatedat TIMESTAMP NOT NULL,
        version INT NOT NULL,
        CONSTRAINT fk_userid
          FOREIGN KEY (userid)
          REFERENCES userrecord(id) 
          ON DELETE CASCADE 
      );`
    );
  }

  async createUser(user: User) {
    await this.client!.query(
      `INSERT INTO userrecord(id, email, password, version) VALUES($1, $2, $3, $4);`,
      [user.id, user.email, user.password, 0]
    );
  }

  async getUser(user: User) {
    const userRecord = await this.client!.query(
      `SELECT id, email, password, version FROM userrecord WHERE id=$1`,
      [user.id]
    );
    if (userRecord.rows.length == 0) {
      throw new NotFoundError();
    }
    return userRecord.rows[0];
  }

  async getPasswords(user: User) {
    const userRecords = await this.client!.query(
      `SELECT id, domain, password, updatedat
        FROM passwordrecord
        WHERE userid=$1;`,
      [user.id]
    );
    return userRecords.rows;
  }

  async getPassword(user: User, password: Password) {
    const passwordRecord = await this.client!.query(
      `SELECT id, domain, password, userId, updatedat
        FROM passwordrecord
        WHERE userid=$1 AND id=$2;`,
      [user.id, password.id]
    );
    return passwordRecord.rows[0];
  }

  async insertPassword(user: User, password: Password) {
    const { id, userId, domain, password: psw, updatedAt } = password;
    await this.client!.query(
      `INSERT INTO passwordrecord(id, userId, domain, password, updatedat, version) VALUES($1, $2, $3, $4, $5, $6);`,
      [id, userId, domain, psw, updatedAt, 0]
    );
  }

  async updatePassword(user: User, password: Password) {
    const { id, userId, domain, password: psw, updatedAt, version } = password;
    const updatedPassword = await this.client!.query(
      `UPDATE passwordrecord
        SET domain=$1, 
            password=$2, 
            updatedat=$3, 
            version=$4 
        WHERE id=$5 AND version=$6
        RETURNING *;`,
      [domain, psw, updatedAt, version!, id, version! - 1]
    );
    if (updatedPassword.rows.length == 0) {
      throw new NotFoundError();
    }
    return updatedPassword.rows[0];
  }

  async deletePassword(user: User, password: Password) {
    await this.client!.query(
      `DELETE FROM passwordrecord
        WHERE id=$1 and userid=$2
        RETURNING *;`,
      [password.id, user.id]
    );
  }
}

export const postgresRepository = new PostgresRepository();
