import { DataTypes } from 'sequelize';
import { sequelize } from '../config/data-source';
import Form from './Form';

const FormSubmission = sequelize.define('FormSubmissions', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  form_id: {
    type: DataTypes.INTEGER,
    references: {
      key: 'id',
      model: Form
    }
  }
});

FormSubmission.belongsTo(Form);

export default FormSubmission;
