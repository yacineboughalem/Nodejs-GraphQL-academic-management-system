import { Resolver, Query, Mutation, Arg, Float, Int, Authorized } from "type-graphql";
import { Note } from "../entities/Note";
import { AppDataSource } from "../database/config";
import { Student } from "../entities/Student";
import { Module } from "../entities/Module";

@Resolver()
export class NoteResolver {
  @Query(() => [Note])
  async notes(): Promise<Note[]> {
    return await AppDataSource.getRepository(Note).find({
      relations: ["student", "module"],
    });
  }
  @Authorized()
  @Mutation(() => Note)
  async addNote(
    @Arg("studentId", () => Int) studentId: number,
    @Arg("moduleId", () => Int) moduleId: number,
    @Arg("control", () => Float) control: number,
    @Arg("practical", () => Float) practical: number,
    @Arg("finalExam", () => Float) finalExam: number
  ): Promise<Note> {
    const student = await AppDataSource.getRepository(Student).findOneByOrFail({ id: studentId });
    const module = await AppDataSource.getRepository(Module).findOneByOrFail({ id: moduleId });

    const average = parseFloat(
      ((control * 0.3 + practical * 0.2 + finalExam * 0.5).toFixed(2))
    );

    const note = AppDataSource.getRepository(Note).create({
      student,
      module,
      control,
      practical,
      finalExam,
      average,
    });

    return await AppDataSource.getRepository(Note).save(note);
  }
}
