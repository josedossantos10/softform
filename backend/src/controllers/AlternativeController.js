const connection = require('../database/connection');

module.exports = {
  async find(request, response) {
    const { questionId } = request.params;

    const alternatives = await connection('alternatives')      
      .where('questionId', questionId)
      .select('text');

    return response.json(alternatives.map(a => a.text));
  },

  // Insert new alternatives on a existing question (must have questionId)
  async create(request, response) {
    const { questionId, alternatives } = request.body;
    
    const alts = alternatives.map(a => ({questionId: questionId, text: a}))
    
    const ids = await connection('alternatives').insert(alts);

    return response.status(204).send();
  },

  async update(request, response) {
    const { id, questionId, text } = request.body;

    await connection('alternatives')
      .where('id', id)
      .update({
        id,
        questionId,
        text
      });

    return response.status(204).send();
  },

  async delete(request, response) {
    const { questionId } = request.params;

    await connection('alternatives')
      .where('questionId', questionId)
      .delete();

    return response.status(204).send();
  }
};