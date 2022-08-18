import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index.js';

process.env.NODE_ENV = 'test';
chai.use(chaiHttp);
let should = chai.should();

describe("Health check", function() {
    it("returns status 200", function(done) {
        chai.request(app)
            .get('/')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('status');
                res.body.should.have.property('status').eql('success');
                done();
            });
    });

    it("returns status 404", function(done) {
        chai.request(app)
            .get('/test')
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.have.property('status');
                res.body.should.have.property('status').eql('fail');
                done();
            });
    });
});
