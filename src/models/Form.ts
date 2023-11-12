import { sequelize } from '../config/data-source';
import { DataTypes } from 'sequelize';
import User from './User';

const Form = sequelize
  .define('Forms', {
    name: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [4, 64]
      }
    },
    description: {
      type: DataTypes.TEXT({ length: 'long' }),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [4, 4096]
      }
    },
    content: {
      type: DataTypes.ARRAY(),
      allowNull: false
    },
    visits: {
      type: DataTypes.INTEGER(),
      defaultValue: 0,
      allowNull: false,
      validate: {
        isInt: true
      }
    },
    published: {
      type: DataTypes.BOOLEAN(),
      defaultValue: false,
      allowNull: false
    },
    share_url: {
      type: DataTypes.UUIDV4(),
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true
    }
  })
  .belongsTo(User);

export default Form;
