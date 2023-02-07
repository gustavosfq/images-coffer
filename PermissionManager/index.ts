import fs from "fs";

const PERMISSIONS_PATH = "./permittedUsers.txt";

class PermissionManager {
  public permitedUsers = [];
  constructor() {
    this.permitedUsers = fs.readFileSync(PERMISSIONS_PATH, "utf-8").split("\n");
  }

  public isPermited(userNumber: string) {
    userNumber = userNumber.replace("@c.us", "");
    return this.permitedUsers.includes(userNumber);
  }

  public addPermitedUser(userNumber: string) {
    userNumber = userNumber.replace("@c.us", "");
    if (!this.isPermited(userNumber)) {
      this.permitedUsers.push(userNumber);
      fs.appendFileSync(PERMISSIONS_PATH, `${userNumber}\n`);
    }
  }

  public removePermitedUser(userNumber: string) {
    userNumber = userNumber.replace("@c.us", "");
    if (this.isPermited(userNumber)) {
      this.permitedUsers = this.permitedUsers.filter(
        (user) => user !== userNumber
      );
      fs.writeFileSync(PERMISSIONS_PATH, this.permitedUsers.join("\n"));
    }
  }

  public getPermitedUsers() {
    return this.permitedUsers;
  }
}

export default PermissionManager;
