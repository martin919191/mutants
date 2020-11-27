let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;

chai.use(chaiHttp);
const url = 'http://localhost:3001';

let currentCount = 0;

describe('Get stats before other tests: ', () => {
    it('Stat properties', (done) => {
        chai.request(url)
            .get('/stats')
            .end(function (err, res) {
                console.log(res.body)

                expect(res).to.have.status(200);
                expect(res.body).to.have.property('count_human_dna');
                expect(res.body).to.have.property('count_mutant_dna');
                expect(res.body).to.have.property('ratio');

                currentCount = res.body['count_human_dna'] + res.body['count_mutant_dna'];
                done();
            });
    });
});


describe('Send a human DNA sequence: ', () => {
    it('Result Status 404', (done) => {
        chai.request(url)
            .post('/mutant')
            .send({ "dna": ["CTGCCA", "CAGTGC", "TTATGT", "AGAAGG", "CTCCTA", "TCACTG"] })
            .end(function (err, res) {
                expect(res).to.have.status(403);
                done();
            });
    });
});

describe('Send a mutant DNA sequence: ', () => {
    it('Result Status 200', (done) => {
        chai.request(url)
            .post('/mutant')
            .send({ "dna": ["ATGCGA", "CAGTGC", "TTATGT", "AGAAGG", "CTCCTA", "TCACTG"] })
            .end(function (err, res) {
                expect(res).to.have.status(200);
                done();
            });
    });
});

describe('Get stats before other tests: ', () => {
    it('Stats ok after insert DNA sequences in other tests.', (done) => {
        chai.request(url)
            .get('/stats')
            .end(function (err, res) {
                console.log(res.body)

                expect(res).to.have.status(200);
                expect(res.body).to.have.property('count_human_dna');
                expect(res.body).to.have.property('count_mutant_dna');
                expect(res.body).to.have.property('ratio');
                expect(res.body['count_human_dna'] + res.body['count_mutant_dna']).to.be.equal(currentCount + 2);
                done();
            });
    });
});

