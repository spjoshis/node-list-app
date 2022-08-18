import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index.js';

process.env.NODE_ENV = 'test';
chai.use(chaiHttp);
let should = chai.should();

describe("It should return 200 with empty payload", function() {
    it("returns status 200 with empty response", function(done) {
        chai.request(app)
            .post('/process-cycle')
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });
});


describe("It should return true for valid lists", function() {
    it("returns status 200 with list-1: true", function(done) {
        const list = {
            "list-1": [0, 1]
        }
        chai.request(app)
            .post('/process-cycle')
            .send(list)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('list-1');
                res.body.should.have.property('list-1').eql(true);
                res.body.should.not.have.property('list-2');
                done();
            });
    });

    it("returns status 200 with list-1: true, list-2: true", function(done) {
        const list = {
            "list-1": [0, 1],
            "list-2": [0, 1]
        }
        chai.request(app)
            .post('/process-cycle')
            .send(list)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('list-1');
                res.body.should.have.property('list-1').eql(true);
                res.body.should.have.property('list-2');
                res.body.should.have.property('list-2').eql(true);
                done();
            });
    });
});


describe("It should return false for multiple lists", function() {
    it("returns false for list-1 having int value", function(done) {
        const list = {
            "list-1": 0
        }
        chai.request(app)
            .post('/process-cycle')
            .send(list)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('list-1');
                res.body.should.have.property('list-1').eql(false);
                done();
            });
    });

    it("returns false for list-1 having string value", function(done) {
        const list = {
            "list-1": 'This is string'
        }
        chai.request(app)
            .post('/process-cycle')
            .send(list)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('list-1');
                res.body.should.have.property('list-1').eql(false);
                done();
            });
    });

    it("returns false for list-1 having boolean value", function(done) {
        const list = {
            "list-1": true
        }
        chai.request(app)
            .post('/process-cycle')
            .send(list)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('list-1');
                res.body.should.have.property('list-1').eql(false);
                done();
            });
    });

    it("returns false for list-1 having object value", function(done) {
        const list = {
            "list-1": {param: false}
        }
        chai.request(app)
            .post('/process-cycle')
            .send(list)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('list-1');
                res.body.should.have.property('list-1').eql(false);
                done();
            });
    });
});


describe("It should return false for multiple duplicate lists", function() {
    it("returns false for duplicate values in array", function(done) {
        const list = {
            "list-1": [2, 4, 1, 1, 5, 3],
            "list-2": [1, 5, 3, 2, 2]
        }
        chai.request(app)
            .post('/process-cycle')
            .send(list)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('list-1');
                res.body.should.have.property('list-1').eql(false);

                res.body.should.have.property('list-2');
                res.body.should.have.property('list-2').eql(false);
                done();
            });
    });

    it("returns false for duplicate payload", function(done) {
        const list = {
            "list": [2, 4, 1, 1, 5, 3],
            "list": [1, 5, 3, 2, 2]
        }
        chai.request(app)
            .post('/process-cycle')
            .send(list)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('list');
                res.body.should.have.property('list').eql(false);
                done();
            });
    });
});

describe("It should return true for multiple valid lists", function() {
    it("returns true for list-1 and false for list-2", function(done) {
        const list = {
            "list-1": [3, 0, 1, 2],
            "list-2": [5 , 7, 8, 2, 3, 9, 3, 1, 0]
        }
        chai.request(app)
            .post('/process-cycle')
            .send(list)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('list-1');
                res.body.should.have.property('list-1').eql(true);

                res.body.should.have.property('list-2');
                res.body.should.have.property('list-2').eql(false);
                done();
            });
    });


    it("returns true for list-1 and list-2 having array of 100 elements", function(done) {
        const list = {
            "list-1": Array.from({length: 100}, () => Math.floor(Math.random() * 40)),
            "list-2": Array.from({length: 200}, () => Math.floor(Math.random() * 40))
        }
        chai.request(app)
            .post('/process-cycle')
            .send(list)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('list-1');
                res.body.should.have.property('list-1').eql(false);

                res.body.should.have.property('list-2');
                res.body.should.have.property('list-2').eql(false);
                done();
            });
    });

    it("returns true for 100 list payload", function(done) {
        let list = {};

        [...Array(100).keys()].forEach((i) => {
            list['list-' + i] = [...Array(100).keys()];
        });

        chai.request(app)
            .post('/process-cycle')
            .send(list)
            .end((err, res) => {
                res.should.have.status(200);

                [...Array(100).keys()].forEach((i) => {
                    res.body.should.have.property('list-' + i);
                    res.body.should.have.property('list-' + i).eql(false);
                });
                
                done();
            });
    });
});