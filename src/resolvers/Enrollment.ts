import { Resolver, Query, Mutation, Arg, Int } from "type-graphql";
import { Enrollment } from "../entities/Enrollment";
import { AppDataSource } from "../database/config";
import { Student } from "../entities/Student";
import { Module } from "../entities/Module";

@Resolver()
export class EnrollmentResolver {
  @Query(() => [Enrollment])
  async Enrollments(): Promise<Enrollment[]> {
    return await AppDataSource.getRepository(Enrollment).find({
      relations: ["student", "module"],
    });
  }

  @Mutation(() => Enrollment)
  async enrollStudentToModule(
    @Arg("studentId", () => Int) studentId: number,
    @Arg("moduleId", () => Int) moduleId: number,
    @Arg("academicYear") academicYear: string
  ): Promise<Enrollment> {
    const student = await AppDataSource.getRepository(Student).findOneByOrFail({ id: studentId });
    const module = await AppDataSource.getRepository(Module).findOneByOrFail({ id: moduleId });

    const enrollment = AppDataSource.getRepository(Enrollment).create({
      student,
      module,
      academicYear,
    });

    return await AppDataSource.getRepository(Enrollment).save(enrollment);
  }
}
