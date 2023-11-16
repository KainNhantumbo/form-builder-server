import Form from './form.model';
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/data-source';

const Submission = sequelize.define('Submissions', {
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
    type: DataTypes.HSTORE,
    allowNull: false
  }
});

export default Submission;
