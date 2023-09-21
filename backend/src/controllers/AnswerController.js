const connection = require('../database/connection');
const moment = require('moment');
require('dotenv').config();

module.exports = {
  async index(request, response) {
    const answers = await connection('answers').select('*');

    return response.json(answers);
  },
  
  async save(request, response) {
    let {
      userId,
      questionId,
      answer,
      monitoring,
      answeredAt
    } = request.body;
    let diff = 0;
  
    const trx = await connection.transaction();
  
    try {
      if (monitoring) {
        answeredAt = new Date(answeredAt).toISOString().slice(0, 19).replace('T', ' ');
  
        const [{ max, min }] = await trx('questions')
        .where('monitoring', true)
        .max('id', { as: 'max' })
        .min('id', { as: 'min' });

        if (questionId === max) {
          await trx('monitoring')
            .where('userId', userId)
            .whereNull('finishedAt')
            .whereNotNull('startedAt')
            .update({
              [questionId]: answer,
              finishedAt: answeredAt
            });
        } else {
          if (questionId === min) {
            await trx('monitoring')
              .where('userId', userId)
              .whereNull('startedAt')
              .whereNull('finishedAt')
              .update({
                startedAt: answeredAt
              });
          }
  
          await trx('monitoring')
            .where('userId', userId)
            .whereNull('finishedAt')
            .update({
              [questionId]: answer
            });
        }
  
        const user = await trx('users')
          .where('id', userId)
          .select('finishedAt')
          .first();
  
        // recupera uma resposta para uma questao e usuario especifico
        const previousAnswer = await trx('answers')
          .where('questionId', questionId)
          .andWhere('userId', userId)
          .select('*')
          .orderBy('id', 'desc')
          .first();
  
        // verifica a diferenca de tempo entre a resposta e o finishedAt  
        if (previousAnswer && user.finishedAt) {
          diff = moment(previousAnswer.answeredAt).diff(moment(user.finishedAt), 'seconds');
        }
  
        // verifica se a reposta é mais recente que o finishedAt
        //VERIFICAR: Quanto tiver varias respostas o codigo gerante que foi a mais nova?
        if (diff > 0 && previousAnswer) {
          await trx('answers')
            .where('id', previousAnswer.id)
            .update({
              answer,
              answeredAt
            });
        } else {
          await trx('answers')
            .insert({
              userId,
              questionId,
              answer,
              answeredAt
            });
        }
      } else {
        const previousAnswer = await trx('answers')
          .where('questionId', questionId)
          .andWhere('userId', userId)
          .select('id')
          .first();
  
        if (previousAnswer) {
          await trx('answers')
            .where('id', previousAnswer.id)
            .update({
              answer
            });
        } else {
          await trx('answers')
            .insert({
              userId,
              questionId,
              answer
            });
        }
  
        await trx('risk')
          .where('userId', userId)
          .whereNull('finishedAt')
          .update({
            [questionId]: answer
          });
      }
  
      await trx.commit();
  
      return response.status(204).send();
    } catch (error) {
      await trx.rollback();
  
      return response.status(500).json({
        error: 'Unexpected error while saving answer'
      });
    }
  },
  async findByUser(request, response) {
    const { userId } = request.params;

    const answers = await connection('answers')
      .where('userId', userId)
      .select('answer', 'questionId');

    return response.json(answers);
  },

  async findByQuestion(request, response) {
    const { questionId } = request.params;

    const answers = await connection('answers')
      .where('questionId', questionId)
      .select('answer', 'questionId');

    return response.json(answers);
  },

  async delete(request, response) {
    const { questionId } = request.params;

    await connection('answers')
      .where('questionId', questionId)
      .delete();

    return response.status(204).send();
  }
};