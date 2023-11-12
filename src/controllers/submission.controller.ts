import { IReq, IRes } from '../types';
import { sequelize } from '../config/data-source';
import Submission from '../models/submission.model';

export default class SubmissionController {
  async getSubmisions(req: IReq, res: IRes) {
    const {
      params: { id: formId },
      body: { user }
    } = req;

    const result = await sequelize.transaction(async (t) => {
      return await Submission.findAll({
        where: { user_id: user.id, form: formId },
        transaction: t
      });
    });

    res.status(200).json([...result]);
  }

  async createSubmisions(req: IReq, res: IRes) {
    const {
      params: { id: formId },
      body: { user, ...data }
    } = req;

    await sequelize.transaction(async (t) => {
      await Submission.create(
        { ...data, form: String(formId) },
        { transaction: t, validate: true }
      );
    });

    res.sendStatus(201);
  }

  async deleteSubmisions(req: IReq, res: IRes) {
    const { id: submissionId } = req.params;

    await sequelize.transaction(async (t) => {
      await Submission.destroy({
        where: { id: submissionId },
        transaction: t,
        cascade: true
      });
    });

    res.sendStatus(204);
  }
}
