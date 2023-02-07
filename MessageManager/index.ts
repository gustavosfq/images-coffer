import { Message } from "whatsapp-web.js";
import FileManager from "../FileManager/indes";
import PermissionManager from "../PermissionManager";

class MessageManager {
  public message: Message;
  constructor(message: Message) {
    this.message = message;
  }

  public async saveMedia(fileManager: FileManager) {
    try {
      fileManager.createFolderIfNotExists(this.message.from);
      fileManager.writeToFile(
        this.message.from,
        await this.message.downloadMedia()
      );
      this.message.reply("File saved");
    } catch (error) {
      console.log(error);
      this.message.reply("Error saving file");
    }
  }

  public sendUserList(permissionManager: PermissionManager) {
    this.message.reply(permissionManager.getPermitedUsers().join("\n"));
  }
}

export default MessageManager;
