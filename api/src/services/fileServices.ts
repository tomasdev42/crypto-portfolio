import dotenv from "dotenv";
import path from "path";
import fs from "fs";

dotenv.config();
const IMAGE_PATH: string = path.join(__dirname, "..", "uploads", "images");

export const saveFile = async (
  key: string,
  content: Buffer,
  overwrite: Boolean = false
) => {
  const filePath = path.join(IMAGE_PATH, key);

  if (!overwrite && fs.existsSync(filePath)) {
    return false;
  }

  fs.writeFileSync(filePath, content);
  return true;
};

export const deleteFile = async (key: string) => {
  const filePath: string = path.join(IMAGE_PATH, key);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return true;
  }

  return false;
};
