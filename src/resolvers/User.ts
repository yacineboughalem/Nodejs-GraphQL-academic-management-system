import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { User, UserRole } from "../entities/User";
import { AppDataSource } from "../database/config";
import { hash } from "bcryptjs";

@Resolver()
export class UserResolver {
  @Query(() => [User])
  async users(): Promise<User[]> {
    return await AppDataSource.getRepository(User).find();
  }

  @Mutation(() => User)
  async createUser(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Arg("role", () => UserRole, { defaultValue: UserRole.STUDENT }) role: UserRole
  ): Promise<User> {
    const hashedPassword = await hash(password, 10);
    const user = AppDataSource.getRepository(User).create({ email, password: hashedPassword, role });
    return await AppDataSource.getRepository(User).save(user);
  }
}
