import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
// const rootPath = path.resolve(new URL(import.meta.url).pathname, '../../');
const envPath = path.join(__dirname, '..', '.env');

// path.join(__dirname, '..', '.env');

// console.log("__dirname: ", __dirname)
// console.log("__filename: ", __filename)
// console.log("rootPath: ", rootPath)
// console.log("envPath: ", envPath)
// console.log("hard code config: ", dotenv.config({path: "C:/Users/nicol/OneDrive/Desktop/CSTP2107_summer/CSTP2107-midterm/backend/.env"}));
// console.log("envPath.config: ", dotenv.config({ path: envPath }))

dotenv.config({path: envPath})

// const apiKey = process.env.JWT_SECRET;

// try {
//     console.log("apiKey:", apiKey)
// } catch (error) {
//     console.log("err: ", error)
// }