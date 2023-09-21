const connection = require('../database/connection');
const crypto = require('crypto');

const generateRandomString = (length = 8) => (
  Math.random().toString(20).substr(2, length)
);

module.exports = {
  async index(request, response) {
    const users = await connection('users').select('*');

    return response.json(users);
  },

  async create(request, response) {
    const { center, amount, length } = request.body;
    
    if (!(center && amount)) {
      return response.status(400).json({ error: 'Há parâmetros ausentes' });
    }

    const trx = await connection.transaction();
    const ids = Array.apply(null, Array(amount)).map((val, idx) =>
      JSON.parse(
        JSON.stringify({
          id: center + generateRandomString(length),
        })
      )
    );

    try {
      await trx('users').insert(ids);
      await trx.commit();

      return response.status(200).json(ids.map(id => id.id));
    } catch (error) {
      await trx.rollback();

      return response.status(500).json({ error: 'Não foi possível criar usuários, tente novamente' });
    }
  },

  async createSingle(request, response) {
    const { center, length } = request.body;

    if (!center) {
      return response.status(400).json({ error: 'Há parâmetros ausentes' });
    }

    const trx = await connection.transaction();
    
    try {
      const id = center + generateRandomString(length);

      await trx('users').insert({ id });
      await trx.commit();

      return response.status(200).send(id);
    } catch (error) {
      await trx.rollback();

      return response.status(500).json({ error: 'Não foi possível criar usuário, tente novamente' })
    }

  },

  async register(request, response) {
    const { id, occupation, gender, age, ethnicity } = request.body;
    const startedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const trx = await connection.transaction();

    try {
      await trx('users')
        .where('id', id)
        .update({
          occupation,
          gender,
          age,
          ethnicity
        })
      
      await trx('risk')
        .insert({
          userId: id,
          occupation,
          gender,
          age,
          ethnicity,
          startedAt
        });

      await trx('monitoring')
      .insert({
        userId: id,
      });

      await trx.commit();
      
      return response.status(201).send();
    } catch (error) {
      await trx.rollback();

      return response.status(400).json({
        error: 'Unexpected error while registering'
      });
    }
  },

  async registerNetworking(request, response) {
    const { id, a, b, c, d } = request.body;

    const trx = await connection.transaction();

    try {
      await trx('users')
        .where('id', id)
        .update({
          a,
          b,
          c,
          d,
        });
      
      await trx('risk')
      .where('userId', id)
      .update({
        a,
        b,
        c,
        d,
      });
      
      await trx.commit();

      return response.status(204).send();
    } catch (error) {
      await trx.rollback();

      return response.status(400).json({
        error: 'Unexpected error while saving networking'
      });
    }
  },

  async setAcceptedTerms(request, response) {
    const { id } = request.body;
    const termsAcceptedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');

    try {
      await connection('users')
        .where('id', id)
        .whereNull('termsAcceptedAt')  
        .update({
          termsAcceptedAt
        });
  
      const user = await connection('users')
      .where('id', id)
      .select('*')
      .first();
      
      return response.json(user);
    } catch (error) {
      return response.status(500).json({ 
        error: 'Unexpected error while accepting terms'
      });
    }
  },

  async setFinished(request, response) {
    const { id } = request.body;
    let { finishedAt } = request.body;

    finishedAt = new Date(finishedAt).toISOString().slice(0, 19).replace('T', ' ');

    const trx = await connection.transaction();

    try {
      await trx('users')
        .where('id', id)  
        .update({
          finishedAt
      });
  
      await trx('risk')
      .where('userId', id)
      .whereNull('finishedAt')  
      .update({
        finishedAt
      });
      
      await trx('monitoring')
      .insert({
        userId: id,
      });

      await trx.commit();

      return response.status(204).send();
    } catch (error) {
      await trx.rollback();

      return response.status(400).json({
        error: 'Unexpected error while updating user'
      });
    }    
  },

  async getUser(request, response) {
    const { adminId, password, id} = request.body;
    const admin = await connection('admins').where({id : adminId, password:password}).select('*').first();
    
    if (admin && admin.active && admin.centerId && admin.centerId === parseInt(id[0])) {
      user = await connection('users')
      .where('id' , id)
      .select('*').first();
      return response.json(user)

    } else if (admin && admin.active && !admin.centerId) {
      user = await connection('users')
      .where('id' , id)
      .select('*').first();
      return response.json(user)

    }
    
    return response.status(400).json({ error: 'Não Autorizado!' })
    

  },

  async setUser(request, response) {
    const { id, password, user, operation} = request.body;
    const admin = await connection('admins').where({id : id, password:password}).select('*').first();
    let date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const trx = await connection.transaction();

    try{
    if (admin && admin.active && admin.centerId && admin.centerId === parseInt(user.id[0])) {
      await trx('users')
      .where('id', user.id)  
      .update({active:user.active});

      await trx('logs')
      .insert({
        admin_user: admin.id,
        description: operation+':'+(user.active? 'Ativou':'Desativou'),
        date: date,
      });
      await trx.commit();
      return response.status(200).send()

    } else if (admin && admin.active && !admin.centerId) {
      await trx('users')
      .where('id', user.id)  
      .update({active:user.active});

      await trx('logs')
      .insert({
        admin_user: admin.id,
        description: operation+':'+(user.active? 'Ativou':'Desativou'),
        date: date,
      });
      await trx.commit();
      return response.status(200).send()

    }else{
      return response.status(400).json({ error: 'Não Autorizado!' })
    }
  } catch (error) {
    console.log(error)
    await trx.rollback();
    return response.status(400).json({
      error: 'Unexpected error while updating user'
    });
  }
    
  }

};
