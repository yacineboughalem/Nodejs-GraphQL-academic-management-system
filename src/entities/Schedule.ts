import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { Module } from "./Module";

@ObjectType()
@Entity()
export class Schedule {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  day!: string;

  @Field()
  @Column()
  startTime!: string; 

  @Field()
  @Column()
  endTime!: string; 

  @Field()
  @Column()
  room!: string;

  @Field(() => Module)
  @ManyToOne(() => Module)
  module!: Module;

  @Field()
  @CreateDateColumn()
  createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
