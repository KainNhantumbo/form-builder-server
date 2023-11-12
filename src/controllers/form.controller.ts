import { Op } from 'sequelize';
import { z } from 'zod';
import { sequelize } from '../config/data-source';
import AppError from '../lib/app-error';
import Form from '../models/Form';
import { IReq, IRes, QueryOptions } from '../types';

export default class FormController {
  async getForm(req: IReq, res: IRes) {
    const {
      body: { user },
      params: { id: formId }
    } = req;

    const form = await sequelize.transaction(async (t) => {
      const result = await Form.findOne({
        where: { id: formId, user_id: user.id },
        transaction: t
      });
      return result;
    });

    res.status(200).json({ ...form });
  }

  async getForms(req: IReq, res: IRes) {
    const { search, visits, published, sort, offset, limit } = req.query;
    const { user } = req.body;

    let queryOptions: QueryOptions = {
      sort: ['name', 'DESC'],
      limit: undefined,
      offset: undefined
    };

    const query = { user_id: user.id };

    if (search) {
      query[Op.or] = [
        { name: { [Op.iLike]: String(search) } },
        { description: { [Op.iLike]: String(search) } }
      ];
    }

    if (visits) query['visits'] = Number(visits);

    if (published) query['published'] = Boolean(Number(published));

    if (sort) {
      const formattedSort = String(sort).split(',');
      if (formattedSort.length === 2) {
        queryOptions.sort = [formattedSort[0], formattedSort[1].toUpperCase()];
      }
    }

    if (limit && offset)
      queryOptions = {
        ...queryOptions,
        limit: Number(limit),
        offset: Number(offset)
      };

    const forms = await sequelize.transaction(async (t) => {
      const result = await Form.findAll({
        where: { ...query },
        order: queryOptions.sort,
        limit: queryOptions.limit,
        offset: queryOptions.offset,
        transaction: t
      });

      return result;
    });

    res.status(200).json([...forms]);
  }

  async createForm(req: IReq, res: IRes) {
    const { user, ...data } = req.body;

    await sequelize.transaction(async (t) => {
      await Form.create({ user_id: user.id, ...data });
    });

    res.sendStatus(201);
  }

  async updateForm(req: IReq, res: IRes) {
    const {
      params: { id: formId },
      body: { user, ...data }
    } = req;

    await sequelize.transaction(async (t) => {
      await Form.update(
        { ...data },
        { where: { id: formId, user_id: user.id }, transaction: t }
      );
    });

    res.sendStatus(200);
  }

  async deleteForm(req: IReq, res: IRes) {
    const { id: formId } = req.params;
    const { user } = req.body;

    const result = await sequelize.transaction(async (t) => {
      const result = await Form.destroy({
        where: { id: formId, user_id: user.id },
        transaction: t,
        cascade: true
      });
      return result;
    });

    if (result < 1) throw new AppError('Failed to delete form', 400);
    res.sendStatus(204);
  }
}
