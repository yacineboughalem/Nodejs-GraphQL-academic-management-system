import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";

import { User } from "../entities/User";
import { Student } from "../entities/Student";
import { Module } from "../entities/Module";
import { Note } from "../entities/Note";
import { Enrollment } from "../entities/Enrollment";
import { Schedule } from "../entities/Schedule";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432", 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: true,
  entities: [
    User,
    Student,
    Module,
    Note,
    Enrollment,
    Schedule
  ],
});
