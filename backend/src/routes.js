const express = require('express');

const SessionController = require('./controllers/SessionController');
const SessionAdminController = require('./controllers/SessionAdminController');
const UserController = require('./controllers/UserController');
const QuestionController = require('./controllers/QuestionController');
const AnswerController = require('./controllers/AnswerController');
const ReportController = require('./controllers/ReportController');
const CenterController = require('./controllers/CenterController');
const AnalyticsController = require('./controllers/AnalyticsController');
const LogController = require('./controllers/LogController');
const middlewares = require('./middlewares');

const routes = express.Router();

// Login routes
routes.post('/sessions', SessionController.create);
routes.post('/admin_sessions', SessionAdminController.create);

// 'Users' routes
// routes.get('/users', UserController.index);
routes.post('/users', middlewares.validAdmin,  UserController.create);
routes.post('/users/single', middlewares.validAdmin,  UserController.createSingle);
routes.post('/users/register', UserController.register);
routes.post('/users/networking', UserController.registerNetworking);
routes.post('/users/finish', UserController.setFinished);
routes.post('/users/accept', UserController.setAcceptedTerms);


// 'Questions' routes
routes.get('/questions', middlewares.userActive, QuestionController.index);
// routes.get('/questions/:id', QuestionController.find); //delete
// routes.post('/questions', QuestionController.create); //delete
// routes.put('/questions', QuestionController.update); //delete
// routes.delete('/questions/:id', QuestionController.delete); //delete

// 'Alternatives' routes
// routes.get('/alternatives/:questionId', AlternativeController.find); //delete
// routes.post('/alternatives', AlternativeController.create); //delete
// routes.put('/alternatives', AlternativeController.update); //delete
// routes.delete('/alternatives/:questionId', AlternativeController.delete); //delete

// 'Answers' routes
routes.put('/answers', AnswerController.save);
// routes.get('/answers', AnswerController.index); //delete
// routes.get('/answers/user/:userId', AnswerController.findByUser); //delete
// routes.get('/answers/question/:questionId', AnswerController.findByQuestion); //delete
// routes.delete('/answers/:questionId', AnswerController.delete); //delete

// 'Reports' routes
routes.post('/report/:type', ReportController.getReport);
routes.post('/report-processed/:type', ReportController.getReportProcessed);

// Centers Mapping routes
routes.get('/centers', CenterController.index);
routes.get('/centers/:center', CenterController.find);
routes.post('/centers', middlewares.validAdmin, CenterController.create);

// Users Manager
routes.post('/users-manager-set', UserController.setUser);
routes.post('/users-manager', UserController.getUser);

//Analytics routes
routes.post('/analytics', AnalyticsController.create);

//Log routes
routes.post('/log/outer-response', LogController.create);

module.exports = routes;