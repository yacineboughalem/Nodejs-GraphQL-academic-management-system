import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { Student } from "./Student";
import { Module } from "./Module";

@ObjectType()
@Entity()
export class Enrollment {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => Student)
  @ManyToOne(() => Student)
  student!: Student;

  @Field(() => Module)
  @ManyToOne(() => Module)
  module!: Module;

  @Field()
  @Column()
  academicYear!: string;

  @Field()
  @CreateDateColumn()
  createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
