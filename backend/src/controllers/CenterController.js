const connection = require('../database/connection');

module.exports = {
  async index(request, response) {
      const foundCenters = await connection('centers').select('id', 'centerName');

      return response.json(foundCenters);
  },

  async find(request, response) {
    const { center } = request.params;
    
    try {
      const foundCenter = await connection('centers').where('id', center).select('*').first();
      
      if (!foundCenter) {
        return response.status(400).json({ error: 'No url associated with center code'});
      }

      return response.json(foundCenter);
    } catch (err) {
      return response.status(500).json({ error: 'Could not find center' });
    }
  },

  async create(request, response) {
    const { center, url } = request.body;
    
    try {
      await connection('centers')
        .insert({
          id: center,
          url
      });

      return response.status(204).send();
    } catch (err) {
      return response.status(500).json({ error: 'Could not save center' });
    }
  }
}