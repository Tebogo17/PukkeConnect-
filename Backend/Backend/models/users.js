import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";//import the sequelize instance

//define the user model
const User = sequelize.define("User", {
  FName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  LName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  field: {
    type: DataTypes.STRING,
    allowNull: false
  },
  campus: {
    type: DataTypes.STRING,
    allowNull: false
  },

  role: { 
    type: DataTypes.ENUM("student", "staff"),
     allowNull: false
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
},

 {
   tableName: "users",
   timestamps: true //time created and updated
});

export default User;
