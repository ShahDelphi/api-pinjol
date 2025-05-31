import { DataTypes } from "sequelize";
import db from "../config/Database.js";

const Form = db.define("form", {
  namaLengkap: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  nik: {
  type: DataTypes.STRING,
  allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tanggalLahir: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  alamat: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  agama: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  jobs: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fotoProfil: {
  type: DataTypes.STRING,
  allowNull: true, // karena opsional
  },
  userId: {
  type: DataTypes.INTEGER,
  allowNull: false
  }
}, {
  freezeTableName: true,
});

export default Form;
