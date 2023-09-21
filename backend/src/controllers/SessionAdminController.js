const connection = require('../database/connection');

module.exports = {
  async create(request, response) {
    const { id } = request.body;

    
    var user = await connection('admins').where('id', id).select('*').first();


    if (!user) {
      return response.status(400).json({ error: 'Credenciais fornacidas não encontradas na base de dados.' })
    }
    var {centerName} = user.centerId? await connection('centers').where('id', user.centerId).select('centerName').first(): {centerName:'MASTER'};
    user.centerName = centerName;
    return response.json(user);
  },
  
}
