import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";
import { ObjectType, Field, ID, Float } from "type-graphql";
import { Student } from "./Student";
import { Module } from "./Module";

@ObjectType()
@Entity()
export class Note {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => Float)
  @Column("float")
  control!: number;

  @Field(() => Float)
  @Column("float")
  practical!: number;

  @Field(() => Float)
  @Column("float")
  finalExam!: number;

  @Field(() => Float)
  @Column("float")
  average!: number;

  @Field(() => Module)
  @ManyToOne(() => Module)
  module!: Module;

  @Field(() => Student)
  @ManyToOne(() => Student)
  student!: Student;

  @Field()
  @CreateDateColumn()
  createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
