const connection = require('../database/connection');

module.exports = {
  async create(request, response) {
    const { user_id, timestamp, message } = request.body;
    
    try {
      await connection('log')
        .insert({
          user_id,
          timestamp,
          message,
      });

      return response.status(204).send();
    } catch (err) {
      return response.status(500).json({ error: 'Could not save log' });
    }
  }
}