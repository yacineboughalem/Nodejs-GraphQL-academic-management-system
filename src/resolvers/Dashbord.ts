import { Resolver, Query, ObjectType, Field, Int, Float } from "type-graphql";
import { AppDataSource } from "../database/config";
import { Student } from "../entities/Student";
import { User, UserRole } from "../entities/User";
import { Module } from "../entities/Module";
import { Enrollment } from "../entities/Enrollment";
import { Note } from "../entities/Note";

@ObjectType()
class DashboardStats {
  @Field(() => Int)
  totalStudents!: number;

  @Field(() => Int)
  totalTeachers!: number;

  @Field(() => Int)
  totalModules!: number;

  @Field(() => Int)
  totalEnrollments!: number;

  @Field(() => Float)
  globalAverage!: number;
}

@Resolver()
export class DashboardResolver {
  @Query(() => DashboardStats)
  async dashboard(): Promise<DashboardStats> {
    const studentRepo = AppDataSource.getRepository(Student);
    const userRepo = AppDataSource.getRepository(User);
    const moduleRepo = AppDataSource.getRepository(Module);
    const enrollmentRepo = AppDataSource.getRepository(Enrollment);
    const noteRepo = AppDataSource.getRepository(Note);

    const totalStudents = await studentRepo.count();
    const totalTeachers = await userRepo.count({ where: { role: UserRole.TEACHER } });
    const totalModules = await moduleRepo.count();
    const totalEnrollments = await enrollmentRepo.count();

    const notes = await noteRepo.find();
    const totalAverage =
      notes.reduce((acc, note) => acc + note.average, 0) / (notes.length || 1);

    return {
      totalStudents,
      totalTeachers,
      totalModules,
      totalEnrollments,
      globalAverage: parseFloat(totalAverage.toFixed(2)),
    };
  }
}
