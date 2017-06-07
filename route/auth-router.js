'use strict';

const jsonParser = require('body-parser').json();
const debug = require('debug')('glgram:auth-router');
const Router = require('express').Router;
const basicAuth = require('../lib/basic-auth-middleware.js');

const User = require('../model/user.js');

const authRouter = module.exports = Router();

authRouter.post('/api/signup', jsonParser, function(req, res, next) {
  debug('POST /api/signup');

  let password = req.body.password;
  delete req.body.password;

  let user = new User(req.body);

  user.generatePasswordHash(password)
  .then( user => user.save())
  .then( user => user.generateToken())
  .then( token => res.send(token))
  .catch(next);
});

authRouter.get('/api/signin', basicAuth, function(req, res, next) {
  debug('GET /api/signin');

  User.findOne({ username: req.auth.username })
  .then( user => user.comparePasswordHash(req.auth.password))
  .then( user => user.generateToken())
  .then( token => res.send(token))
  .catch(next);
});

authRouter.put('/api/newUserName', basicAuth, function(req, res, next) {
  debug('PUT /api/newUserName');

  let password = req.auth.password;
  delete req.auth.password;
  User.findOne({ username: req.auth.username })
  .then( user => user.comparePasswordHash(password))
  .then( user => user.findByIdAndUpdate(user._id, req.body, {new: true} ))
  .then( user => {
    res.json(user);
  })
  .catch(next);
});

authRouter.delete('/api/remove/:id', basicAuth, function(req, res, next) {
  debug('DELETE: /api/remove/:id');

  User.findByIdAndRemove(req.params.id)
  .then( () => res.sendStatus(204))
  .catch(next);
});
