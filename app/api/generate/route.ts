// app/api/generate-code/route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs-extra";
import archiver from "archiver";
import path from "path";
import { fileURLToPath } from "url";
import { generateObject, generateText } from "ai";
import { google } from "@ai-sdk/google";
import * as z from "zod";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function POST(req: NextRequest) {
  const {
    name = "",
    description = "",
    frontend = "",
    backend = "",
    database = "",
    mobile = "",
    devops = [],
    tooling = [],
  } = await req.json();

  console.log("body", name);

  if (!name) {
    return NextResponse.json({ error: "name is required." }, { status: 400 });
  }

  try {
    const prompt = `Generate a${backend ? " fullstack" : ""} application boilerplate code for ${
      description ?? "simple todo app"
    } named "${name}" using the following context: ${description}. Use the latest versions of ${frontend}, ${backend}, ${database}, and ${mobile} frameworks, and incorporate the following tools: ${devops.join(
      ", "
    )} and ${tooling.join(
      ", "
    )}. Provide all code in a valid JSON format, structured as 'filename: code'. Additionally, include a section with comprehensive instructions on how to build, run, and test the project.`;
    console.log(prompt);
    const result = await generateObject({
      model: google("gemini-1.5-pro"),
      prompt: prompt,
      schema: z.object({
        content: z.array(
          z.object({
            filename: z.string().describe("name of the folder or file"),
            code: z.string().describe("formated code"),
          })
        ),
        instructions: z.string().describe("Give structured instrctions for installation"),
      }),
    });

    // const jsonContent = text.match(/```json\n([\s\S]+?)\n```/);
    // const textCode = jsonContent ? jsonContent[1] : null;
    // const instructions = text.match(/\*\*Instructions to run the project:\*\*(.*)/is);
    // // console.log("code---->", typeof textCode, textCode);

    let codeinString = await result.toJsonResponse().json();
    console.log("res", codeinString);

    if (codeinString) {
      // codeinString = JSON.parse(textCode);
      // console.log("&&&&&&&&&&&&&&& after json&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&\n", codeinString);
      if (!fs.existsSync("generated_code")) {
        fs.mkdirSync("generated_code");
      }

      const outputDir = path.join(__dirname, "generated_code");
      const zipFilePath = path.join(outputDir, "boilerplate.zip");

      // Create code files
      await fs.ensureDir(outputDir);
      const archive = archiver("zip", { zlib: { level: 9 } });
      const zipStream = fs.createWriteStream(zipFilePath);
      archive.pipe(zipStream);

      for (let { filename, code } of codeinString.content) {
        const filePath = path.join(outputDir, filename);
        const dirPath = path.dirname(filePath); // Get the directory path from the file path

        // Ensure the directory exists before writing the file
        await fs.ensureDir(dirPath); // Creates the directory if it doesn't exist
        await fs.writeFile(filePath, code);
        archive.file(filePath, { name: filename });
      }

      await archive.finalize();

      await new Promise<void>((resolve) => zipStream.on("close", resolve));

      // Read the file as a buffer
      const fileBuffer = await fs.readFile(zipFilePath);

      // Cleanup generated files
      await fs.remove(outputDir);

      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          "Content-Disposition": "attachment; filename=boilerplate.zip",
          "Content-Type": "application/zip",
        },
      });
    } else {
      return NextResponse.json({ error: "Failed to generate code." }, { status: 500 });
    }
  } catch (error: any) {
    console.error("Error generating code:", error.message);
    return NextResponse.json({ error: "Failed to generate code." }, { status: 500 });
  }
}
