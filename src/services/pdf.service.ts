import PDFDocument from "pdfkit";
import { Note } from "../entities/Note";
import { Student } from "../entities/Student";
import { Response } from "express";

export const generateTranscriptPdf = async (
  student: Student,
  notes: Note[],
  res: Response
) => {
  const doc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="transcript_${student.id}.pdf"`);

  doc.pipe(res);

  doc.fontSize(20).text(`Transcript - ${student.firstname} ${student.lastname}`, { align: "center" });
  doc.moveDown();

  notes.forEach((note, index) => {
    doc
      .fontSize(12)
      .text(
        `${index + 1}. ${note.module.label} (${note.module.code}) - Control: ${note.control}, Practical: ${note.practical}, Final: ${note.finalExam}, Average: ${note.average}`
      );
  });

  doc.end();
};
