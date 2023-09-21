const connection = require('../database/connection');
const moment = require('moment');
require('dotenv').config();

module.exports = {

  async getReport(request, response) {
    const { type } = request.params;
    const { id, password } = request.body;

    const user = await connection('admins').where({id : id, password:password}).select('*').first();
    if (user && user.active && user.centerId && user.centerId != 4) {
      const report = await connection(type)
      .whereNot('userId', 'like' , '4%')
      //.where('userId', 'like', user.centerId+'%')
      .select('*');
      
      return response.json(report);
    } else if (user && user.active && user.centerId && user.centerId === 4) {
      report = await connection(type)
      .where('userId', 'like' , '4%')
      //.where('userId', 'like', user.centerId+'%')
      .select('*');

    } else if (user && user.active) {
      const report = await connection(type)
      .select('*');
      
      return response.json(report);
    }
    
    return response.status(400).json({ error: 'Não Autorizado!' })

  },
  async getReportProcessed(request, response) {
    const { type } = request.params;
    const { id, password } = request.body;
    let report = undefined;
    const user = await connection('admins').where({id : id, password:password}).select('*').first();
    
    if (user && user.active && user.centerId && user.centerId != 4) {
      report = await connection(type)
      .whereNot('userId', 'like' , '4%')
      //.where('userId', 'like', user.centerId+'%')
      .select('*');

    } else if (user && user.active && user.centerId && user.centerId === 4) {
      report = await connection(type)
      .where('userId', 'like' , '4%')
      //.where('userId', 'like', user.centerId+'%')
      .select('*');

    } else if (user && user.active) {
      report = await connection(type)
      .select('*');

    } else{
      return response.status(400).json({ error: 'Não Autorizado!' })
    }
    // Pre-processamento dos dados
    if (report && report.length>0){

      let questions = []
      const query = `SELECT COLUMN_NAME
                    FROM INFORMATION_SCHEMA.COLUMNS
                    WHERE TABLE_SCHEMA='<your_scheme>'
                     AND TABLE_NAME='${type}';`
      let  columnNames = await connection.raw(query);
      columnNames[0].forEach(e => questions.push(e['COLUMN_NAME']));
      
      let allQuestions = await connection('questions').select('*')
      // Técnica para preencher o índice [0], alinhando o número do índice com id da questão
      let types = []
      types.push(allQuestions[0])
      for (var i = 0; i <= allQuestions.length; i++) {
        types.push(allQuestions[i])
      };
      // Criando lista de questões a serem ignoradas
      let ignore = ['userId','startedAt','finishedAt','3','6','7','9','11','13','14','15','16', '17','18','19','20','22','23', '27','occupation','gender','age'];
      // Percorrer cada questão encontrada na tabela de relatório   
      for ( e of questions) {
        if(types[e] && types[e].questionType === 'select' && !ignore.includes(String(types[e].id))){
          let alts = await connection('alternatives').where('questionId', types[e].id).select('*');
          alts.forEach((alt)=>{
            let colunmName = ('0'+alt.questionId+'-'+alt.text)
            report.map(function(item){
              // Verifica se há alternativas da questão nesse item, se sim cria uma nova coluna para ele e add seu repectivo valor
              if(item[alt.questionId]){  
                item[colunmName] = item[alt.questionId].split(',').filter(t => {
                  return t.includes(alt.text)
                })[0]
                // Extrai o valor numérico desse item
                item[colunmName] = item[colunmName]? item[colunmName].split('::')[1] : 'Sem valor informado';
              } else{
                item[colunmName] = 'Sem valor informado'
              }
              return item;
            });
          });
          // Após o porocessamento de uma questão em todos os itens, remove essa questão em a mesma questão em cada item
          report.map(item=>{
            // Houve necessidade de adicionar "|| e==8" porquê em alguns items a questão 8 vinha com valores nulos ou branco e 
            // não era removido de todos os itens, permanecendo no relatório final duplicado
            if(item &&( item[e] || e==8 || e==10 || e==12)){
              delete item[e]
            }
            return item;
          })
        }        
        else if(types[e] && types[e].questionType === 'dynamic-select' && !ignore.includes(String(types[e].id))){
          let alts = await connection('alternatives').where('questionId', types[e].id).select('*');
          alts.forEach((alt)=>{
            let colunmName = ('0'+alt.questionId+'-'+alt.text.split('||')[0])
            report.map(function(item){
              // Verifica se há alternativas da questão nesse item, se sim cria uma nova coluna para ele e add seu repectivo valor
              if(item[alt.questionId]){  
                item[colunmName] = item[alt.questionId].split(';').filter(t => {
                  let value = alt.text.split('||')[0]
                  return t.includes(value)
                })[0] 
                // Extrai o texto referente a esse item
                item[colunmName] = item[colunmName]? item[colunmName].split('-').pop() : 'Sem valor informado';
              } else{
                item[colunmName] = 'Sem valor informado'
              }
              return item;
            });
          });
          // Após o porocessamento de uma questão em todos os itens, remove essa questão em a mesma questão em cada item
          report.map(item=>{
            // Houve necessidade de adicionar "|| e==8" porquê em alguns items a questão 8 vinha com valores nulos ou branco e 
            // não era removido de todos os itens, permanecendo no relatório final duplicado
            if(item &&( item[e] || !ignore.includes(e) )){
              delete item[e]
            }
            return item;
          })
        } 
          else if(types[e] && (types[e].questionType === 'radio' || types[e].questionType === 'checkbox') && !ignore.includes(String(types[e].id))){
          let alts = await connection('alternatives').where('questionId', types[e].id).select('*');
          alts.forEach(alt =>{
            let colunmName = ('0'+alt.questionId+'-'+alt.text)
            report.map(function(item){  
              if(item && item[alt.questionId]){
                item[colunmName]= item[alt.questionId].includes(alt.text)? 1:0
              }else{
                item[colunmName]= 0
              }
              return item;
            })
          })
          report.map(item=>{
            if(item &&( item[e] || !ignore.includes(e) )){
              delete item[e]
            }
            return item;
          })
        // Questões ignoradas e itens numérico são entram todos para esse fluxo e são renovados para permanecer ordenado no cvs ou qual quer arquivo final
        }else{
          report.map(item=> {
            if(item){
              temp = item[e]? item[e] : 'Sem valor informado'
              delete item[e]
              if (!isNaN(Number(e))){
                newName = '0'+String(e).toUpperCase();
              }else{
                newName = String(e).toUpperCase();
              }
              item[newName] = temp
            }
            return item;
          })
        }
      }
      return response.json(report);
    }
    
    return response.json(report)

  },

};
