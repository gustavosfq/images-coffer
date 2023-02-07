import fs from "fs";
import qrcode from "qrcode-terminal";
import dotenv from "dotenv";
dotenv.config();

import { Client, LocalAuth } from "whatsapp-web.js";
import FileManager from "./FileManager/indes";
import MessageManager from "./MessageManager/index";
import PermissionManager from "./PermissionManager";

const BASE_PATH = process.env.IMAGES_PATH;
if (!BASE_PATH) {
  throw new Error("IMAGES_PATH is not defined");
}

const fileManager = new FileManager(BASE_PATH);

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message", async (msg) => {
  const permissionManager = new PermissionManager();
  if (!permissionManager.isPermited(msg.from)) {
    msg.reply("You are not permited to use this bot");
    return;
  }
  const messageManager = new MessageManager(msg);
  if (!msg.hasMedia && msg.from.replace("@c.us", "") === process.env.ADMIN) {
    const [command, ...args] = msg.body.split(" ");
    if (command === "add") {
      permissionManager.addPermitedUser(args[0]);
      msg.reply("User added");
      messageManager.sendUserList(permissionManager);
      client.sendMessage(
        args[0].toWhatsAppNumber(),
        "You are now permited to use this bot"
      );
      return;
    }
    if (command === "remove") {
      permissionManager.removePermitedUser(args[0]);
      msg.reply("User removed");
      messageManager.sendUserList(permissionManager);
      client.sendMessage(
        args[0].toWhatsAppNumber(),
        "You are no longer permited to use this bot"
      );
      return;
    }
    if (command === "list") {
      msg.reply(permissionManager.getPermitedUsers().join("\n"));
      return;
    }
    if (command === "disk") {
      msg.reply(await fileManager.getDiskUsage());
      return;
    }
    if (command === "help") {
      msg.reply(
        `Commands:
	add <number> - Add user to permited list
	remove <number> - Remove user from permited list
	list - List all permited users
	disk - Get disk usage
	`
      );
      return;
    }
  }
  if (msg.hasMedia) {
    messageManager.saveMedia(fileManager);
  }
});

client.initialize();

// edit some prototypes

declare global {
  interface Date {
    getCurrentMonthName(): string;
    getShortDateTime(): string;
  }

  interface String {
    toWhatsAppNumber(): string;
  }
}

Date.prototype.getCurrentMonthName = function (lang = "es") {
  return new Intl.DateTimeFormat(lang, { month: "long" }).format(this);
};

Date.prototype.getShortDateTime = function (lang = "es") {
  return this.toISOString().replace(/T/, " ");
};

String.prototype.toWhatsAppNumber = function () {
  return this + "@c.us";
};
