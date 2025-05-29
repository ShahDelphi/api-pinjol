import Users from "./UsersModel.js";
import Form from "./FormModel.js";

Users.hasOne(Form, { foreignKey: "userId" });
Form.belongsTo(Users, { foreignKey: "userId" });
