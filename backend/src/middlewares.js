const connection = require('./database/connection');
const crypto = require('crypto');

module.exports = {
  async userActive(request, response, next) {
    const userId = request.headers.authorization;

    const user = await connection('users')
      .select('*')
      .where('id', userId)
      .first();

    if (!user) {
      return response.status(403).send('User not authorized.');
    } else if (!user.active) {
      return response.json([{
        "id": 1,
        "question": "Sistema indisponível no momento, favor tentar mais tarde. Se o problema persistir, contate nossa equipe",
        "questionType": "not-active",
        "monitoring": 1,
        "alternatives": [],
        "answer": []
      }]);
    } else {
      response.locals.user = user;
    }

    return next();
  },

  async validAdmin(request, response, next) {
    const { login, password } = request.body;

    if (!(login && password)) {
      return response.status(400).json({ error: 'Há parâmetros ausentes.' })
    }

    const user = await connection('admins')
      .where({ id: login })
      .select('*')
      .first();

    if (!user) {
      return response.status(400).json({ error: 'Credenciais não encontradas' })
    }

    const hash = crypto.createHash('md5').update(password).digest('hex');
    const isPasswordMatch = hash === user.password;

    if (!isPasswordMatch) {
      return response.status(403).json({ error: 'Acesso negado' })
    }

    return next();
  }
}