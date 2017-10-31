require('./index.js');
const express = require('express');
const supertest = require('supertest');

describe('express-async-errors', function(){
	it('propagates routes errors to error handler', function(){
		const app = express();       
		

		app.get('/test', async function(){
			throw 'error'
		});

		app.use(function(err, req, res, next){
			res.status(495);
			res.end();
		});

		return supertest(app)
			.get('/test')
			.expect(495)
	});

  it('propagates regular middleware errors too', function(){
    const app = express();

    app.use(async function(){
      throw 'error';
    });

    app.get('/test', async function(){
      throw 'error'
    });


    app.use(function(err, req, res, next){
      res.status(495);
      res.end();
    });

    return supertest(app)
      .get('/test')
      .expect(495)
  });

  it('and propagates error middleware errors too', function(){
    const app = express();

    app.get('/test', async function(){
      throw 'error'
    });

    app.use(async function(err, req, res, next){
      throw 'error';
    });

    app.use(function(err, req, res, next){
      res.status(495);
      res.end();
    });

    return supertest(app)
      .get('/test')
      .expect(495)
  })
});
