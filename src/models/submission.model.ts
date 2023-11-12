import { DataTypes } from 'sequelize';
import { sequelize } from '../config/data-source';
import Form from './form.model';

const Submission = sequelize.define('FormSubmissions', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  form: {
    type: DataTypes.INTEGER,
    references: {
      key: 'id',
      model: Form
    }
  },
  contents: {
    type: DataTypes.ARRAY,
    allowNull: false
  }
});

Submission.belongsTo(Form);

export default Submission;
