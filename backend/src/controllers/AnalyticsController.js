const connection = require('../database/connection');

module.exports = {
  async create(request, response) {
    try {
      const { centersIds } = request.body;

      const { totalParticipants } = await connection('users')
        .count({totalParticipants: 'id'})
        .whereRaw('LEFT(id, 1) IN ?', [[centersIds]])
        .whereNotNull('termsAcceptedAt')
        .andWhere('active', true)
        .first();

      const { totalMonitoring } = await connection('monitoring')
        .count({totalMonitoring: 'userId'})
        .whereRaw('LEFT(userId, 1) IN ?', [[centersIds]])
        .whereNotNull('finishedAt')
        .first();
 
      const { pendingRisk } = await connection('risk')
        .count({pendingRisk: 'userId'})
        .whereRaw('LEFT(userId, 1) IN ?', [[centersIds]])
        .whereNull('finishedAt')
        .first();

      const { pendingMonitoring } = await connection('monitoring')
        .count({ pendingMonitoring: 'userId' })
        .whereRaw('LEFT(userId, 1) IN ?', [[centersIds]])
        .whereNotNull('startedAt')
        .whereNull('finishedAt')
        .first();  

      return response.json({
        totalParticipants,
        totalMonitoring,
        pendingRisk,
        pendingMonitoring,
      });
    } catch (err) {
      console.log(err)
      return response.status(500).json({ error: 'Error while generating analytics' });

    }
  },
};