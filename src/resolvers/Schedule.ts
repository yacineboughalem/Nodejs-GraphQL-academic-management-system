import { Resolver, Query, Mutation, Arg, Int } from "type-graphql";
import { Schedule } from "../entities/Schedule";
import { AppDataSource } from "../database/config";
import { Module } from "../entities/Module";

@Resolver()
export class ScheduleResolver {
  @Query(() => [Schedule])
  async schedules(): Promise<Schedule[]> {
    return await AppDataSource.getRepository(Schedule).find({
      relations: ["module"],
    });
  }

  @Mutation(() => Schedule)
  async createSchedule(
    @Arg("day") day: string,
    @Arg("startTime") startTime: string,
    @Arg("endTime") endTime: string,
    @Arg("room") room: string,
    @Arg("moduleId", () => Int) moduleId: number
  ): Promise<Schedule> {
    const module = await AppDataSource.getRepository(Module).findOneByOrFail({ id: moduleId });

    const schedule = AppDataSource.getRepository(Schedule).create({
      day,
      startTime,
      endTime,
      room,
      module,
    });

    return await AppDataSource.getRepository(Schedule).save(schedule);
  }
}
