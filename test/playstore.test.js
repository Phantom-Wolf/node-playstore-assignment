const supertest = require('supertest');
const app = require('../app');
const { expect } = require('chai');

describe('Playstore /GET', () => {
	it('should return an array of of apps', () => {
		return supertest(app)
			.get('/apps')
			.expect(200)
			.expect('Content-Type', /json/)
			.then(res => {
				expect(res.body).to.be.an('array');
			});
	});
});
