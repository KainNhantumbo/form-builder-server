import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/data-source';
import Form from './form.model';

export interface IUser {
  id: number;
  first_name: string;
  last_name: string;
  password: string;
  email: string;
  updatedAt: string;
  createdAt: string;
  last_session: string;
}

class User extends Model {}
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    first_name: {
      type: DataTypes.STRING({ length: 21 }),
      allowNull: false,
      validate: {
        len: [2, 21],
        notEmpty: true
      }
    },
    last_name: {
      type: DataTypes.STRING({ length: 21 }),
      allowNull: false,
      validate: {
        len: [2, 21],
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING({ length: 64 }),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING(),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    last_session: {
      type: DataTypes.DATE(),
      defaultValue: DataTypes.NOW(),
      validate: {
        isDate: true
      }
    }
  },
  { sequelize, underscored: true }
);

User.hasMany(Form);

export default User;
