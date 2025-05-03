import { Resolver, Query, Mutation, Arg, Int, Authorized } from "type-graphql";
import { Module } from "../entities/Module";
import { AppDataSource } from "../database/config";
import { User } from "../entities/User";

@Resolver()
export class ModuleResolver {
  @Query(() => [Module])
  async modules(
    @Arg("skip", () => Int, { defaultValue: 0 }) skip: number,
    @Arg("take", () => Int, { defaultValue: 10 }) take: number,
    @Arg("semester", { nullable: true }) semester?: string
  ): Promise<Module[]> {
    const query = AppDataSource.getRepository(Module)
      .createQueryBuilder("module")
      .leftJoinAndSelect("module.teacher", "teacher")
      .skip(skip)
      .take(take);
  
    if (semester) {
      query.andWhere("module.semester = :semester", { semester });
    }
  
    return await query.getMany();
  }
  // async modules(): Promise<Module[]> {
  //   return await AppDataSource.getRepository(Module).find({
  //     relations: ["teacher"],
  //   });
  // }


  @Authorized(["ADMIN", "TEACHER"])
  @Mutation(() => Module)
  async createModule(
    @Arg("label") label: string,
    @Arg("code") code: string,
    @Arg("semester") semester: string,
    @Arg("academicYear") academicYear: string,
    @Arg("teacherId", () => Int) teacherId: number
  ): Promise<Module> {
    const teacher = await AppDataSource.getRepository(User).findOneByOrFail({
      id: teacherId,
    });

    const module = AppDataSource.getRepository(Module).create({
      label,
      code,
      semester,
      academicYear,
      teacher,
    });

    return await AppDataSource.getRepository(Module).save(module);
  }
}
