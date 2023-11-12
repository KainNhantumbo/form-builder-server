import { DataTypes } from 'sequelize';
import { sequelize } from '../config/data-source';
import FormSubmission from './FormSubmission';
import User from './User';

const Form = sequelize.define('Forms', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
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
});

Form.belongsTo(User);

Form.hasMany(FormSubmission, {
  foreignKey: 'form_submission_id'
});

export default Form;
