import mongoose from "mongoose";
import chalk from "chalk";

export class Database {
  static async init() {
    //Conexion base de datos
    await mongoose
      .connect(String(process.env.DATABASE))
      .then((dataBase) => {
        console.log("======================DATABASE======================");
        console.log(`STATUS:  ${chalk.greenBright("ONLINE")}`);
        console.log(
          `DATABASE: ${chalk.greenBright(dataBase.connections[0].name)}`
        );
      })
      .catch((error: any) => console.log("Error connecting to MongoDB", error));
  }
}
