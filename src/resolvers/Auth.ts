import { Resolver, Mutation, Arg, ObjectType, Field } from "type-graphql";
import { User } from "../entities/User";
import { AppDataSource } from "../database/config";
import { compare } from "bcryptjs";
import { generateToken } from "../utils/auth";

@ObjectType()
class LoginResponse {
  @Field()
  token!: string;

  @Field(() => User)
  user!: User;
}

@Resolver()
export class AuthResolver {
  @Mutation(() => LoginResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<LoginResponse> {
    const user = await AppDataSource.getRepository(User).findOneBy({ email });

    if (!user) throw new Error("Invalid credentials");

    const isValid = await compare(password, user.password);
    if (!isValid) throw new Error("Invalid credentials");

    const token = generateToken({ userId: user.id, role: user.role });

    return { token, user };
  }
}
