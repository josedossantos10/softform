const connection = require('../database/connection');
const moment = require('moment');
require('dotenv').config();

module.exports = {
  async index(request, response) {
    let questions = answers = [];
    let monitoring;

    const user = response.locals.user;

    const diff = Math.abs(moment().diff(moment(user.finishedAt), 'days'));

    const allQuestions = async () => {
      return await connection('questions').select('*');
    };

    const monitoringQuestions = async () => {
      return await connection('questions')
        .select('*')
        .where('monitoring', true);
    };

     // TODO: alterar o "6" para process.env.NMB_DAYS e botar o mesmo no front
    if (!user.finishedAt) {
      questions = await allQuestions();
      monitoring = false;
    } else if (diff >= 14) {
      questions = await monitoringQuestions();
      monitoring = true;
    }

    const questionIds = questions.map(q => q.id);
    
    const alternatives = await connection('alternatives')
      .whereIn('questionId', questionIds)
      .select('*');

    // Add the alternatives of each question 
    questions.map(q => q.alternatives = alternatives.filter(a => a.questionId === q.id));
    
    if (monitoring) {
      answers = await connection('answers')
        .where('userId', user.id)
        .andWhere('answeredAt', '>', user.finishedAt)
        .whereIn('questionId', questionIds)
        .select('*');
    } else {
      answers = await connection('answers')
        .where('userId', user.id)
        .whereIn('questionId', questionIds)
        .select('*');
    }

    // Add the previous answers of each question
    questions.map(q => q.answer = answers.filter(a => a.questionId === q.id));

    response.header('X-Total-Count', questions.length);

    return response.json(questions);
  },

  async find(request, response) {
    const { id } = request.params;

    const question = await connection('questions')
      .where('id', id)
      .select('*');

    if (!question) {
      return response.status(400).send();
    }

    return response.json(question);
  },

  async create(request, response) {
    const { question, questionType, alternatives } = request.body;

    const [id] = await connection('questions').insert({
      question,
      questionType
    });

    if (alternatives.length) {
      const alts = alternatives.map(a => ({ questionId: id, text: a }))

      const altsIds = await connection('alternatives').insert(alts);
    }

    return response.json({ id });
  },

  // Delete the answers and alternatives, if there are any, before deleting the question
  async delete(request, response) {
    const { id } = request.params;

    await connection('questions')
      .where('id', id)
      .delete();

    return response.status(204).send();
  },

  async update(request, response) {
    const { id, question, questionType } = request.body;

    await connection('questions')
      .where('id', id)
      .update({
        question,
        questionType
      });

    return response.status(204).send();
  }
};
