import { Resolver, Query, Mutation, Arg, Int } from "type-graphql";
import { Student } from "../entities/Student";
import { User, UserRole } from "../entities/User";
import { AppDataSource } from "../database/config";
import { hash } from "bcryptjs";

@Resolver()
export class StudentResolver {
  @Query(() => [Student])
  async students(
    @Arg("skip", () => Int, { defaultValue: 0 }) skip: number,
    @Arg("take", () => Int, { defaultValue: 10 }) take: number,
    @Arg("search", { nullable: true }) search?: string
  ): Promise<Student[]> {
    const query = AppDataSource.getRepository(Student)
      .createQueryBuilder("student")
      .leftJoinAndSelect("student.user", "user")
      .skip(skip)
      .take(take);

    if (search) {
      query.andWhere(
        "LOWER(student.firstname) LIKE :search OR LOWER(student.lastname) LIKE :search",
        { search: `%${search.toLowerCase()}%` }
      );
    }

    return await query.getMany();
  }
  // async students(): Promise<Student[]> {
  //   return await AppDataSource.getRepository(Student).find({
  //     relations: ["user"],
  //   });
  // }

  @Mutation(() => Student)
  async createStudent(
    @Arg("firstname") firstname: string,
    @Arg("lastname") lastname: string,
    @Arg("birthday") birthday: string,
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<Student> {
    const hashedPassword = await hash(password, 10);

    const user = AppDataSource.getRepository(User).create({
      email,
      password: hashedPassword,
      role: UserRole.STUDENT,
    });

    const student = AppDataSource.getRepository(Student).create({
      firstname,
      lastname,
      birthday,
      user,
    });

    return await AppDataSource.getRepository(Student).save(student);
  }
}
