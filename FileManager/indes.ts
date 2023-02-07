import { check } from "diskusage";
import fs from "fs";
import { MessageMedia } from "whatsapp-web.js";
class FileManager {
  private _path: string;

  constructor(path: string) {
    this._path = path.endsWith("/") ? path : `${path}/`;
  }
  path(userNumber: string) {
    const now = new Date();
    return `${
      this._path
    }${userNumber}/${now.getFullYear()}/${now.getCurrentMonthName()}/`;
  }

  public createFolderIfNotExists(userNumber: string) {
    if (!fs.existsSync(this.path(userNumber))) {
      fs.mkdirSync(this.path(userNumber), { recursive: true });
    }
  }

  public async writeToFile(userNumber: string, media: MessageMedia) {
    const fileType = media.mimetype.split("/")[1];
    const fileName = `${new Date().getShortDateTime()}.${fileType}`;
    const path = `${this.path(userNumber)}${fileName}`;
    try {
      fs.writeFileSync(path, media.data, "base64");
    } catch (error) {
      throw new Error(error);
    }
  }

  public async getDiskUsage() {
    const diskUsage = await check(this._path);
    return `
    Free Disk : ${(diskUsage.free / 1000000000).toFixed(2)}GB
    Total Disk : ${(diskUsage.total / 1000000000).toFixed(2)}GB`;
  }
}

export default FileManager;
