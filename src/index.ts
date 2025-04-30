import "reflect-metadata";
import express from "express";
import { buildSchema } from "type-graphql";
import { AppDataSource } from "./database/config";
import { ApolloServer } from "apollo-server-express";
import { UserResolver } from "./resolvers/User";
import { StudentResolver } from "./resolvers/Student";
import { ModuleResolver } from "./resolvers/Module";
import { EnrollmentResolver } from "./resolvers/Enrollment";
import { NoteResolver } from "./resolvers/Note";
import { generateTranscriptPdf } from "./services/pdf.service";
import { Note } from "./entities/Note";
import { Student } from "./entities/Student";
import { ScheduleResolver } from "./resolvers/Schedule";


const app = express();

app.get("/", (_req, res) => {
  res.send("🚀 University Platform API is running");
});

AppDataSource.initialize().then(async () => {
  console.log("📦 Database connected");


  app.get("/students/:id/transcript", async (req, res) => {
    const studentId = parseInt(req.params.id, 10);

    try {
      const student = await AppDataSource.getRepository(Student).findOneByOrFail({ id: studentId });
      const notes = await AppDataSource.getRepository(Note).find({
        where: { student: { id: studentId } },
        relations: ["module"],
      });

      await generateTranscriptPdf(student, notes, res);
    } catch (err) {
      res.status(404).send("Student or notes not found.");
    }
  });

  // GraphQl
  const schema = await buildSchema({
    resolvers: [
      UserResolver, 
      StudentResolver, 
      ModuleResolver, 
      EnrollmentResolver, 
      NoteResolver,
      ScheduleResolver
    ],
  });

  const apolloServer = new ApolloServer({
    schema,
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("✅ Server running on http://localhost:4000/graphql");
  });
});
