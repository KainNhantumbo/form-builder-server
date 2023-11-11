import { DataTypes } from 'sequelize';
import { sequelize } from '../config/data-source';
import * as bcrypt from 'bcrypt';

const User = sequelize
  .define('Users', {
    first_name: {
      type: DataTypes.STRING({ length: 21 }),
      allowNull: false,
      validate: {
        max: 21,
        min: 2,
        notEmpty: true
      }
    },
    last_name: {
      type: DataTypes.STRING({ length: 21 }),
      allowNull: false,
      validate: {
        max: 21,
        min: 2,
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
  })
  .hasMany('Form', {
    foreignKey: 'form_id',
    onDelete: 'CASCADE'
  });

export default User;
