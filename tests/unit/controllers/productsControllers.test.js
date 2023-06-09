const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const { productsControllers } = require('../../../src/controllers');
const { productsServices } = require('../../../src/services');
const { httpStatuses } = require('../../../src/utils/httpStatuses');

const { productsList } = require('../mocks');
const { NOT_FOUND_STATUS, UNPROCESSABLE_ENTITY } = httpStatuses;
const PRODUCT_NOT_FOUND = 'Product not found';
const NAME_TOO_SHORT = '"name" length must be at least 5 characters long';
const { expect } = chai;

chai.use(sinonChai);

describe('The service layer should be able to manage all data successfully', function () {
  describe('The listProducts service should resolve coherent requests', function () {
    afterEach(sinon.restore);
    it('should return all products in an object array with id and product name', async function () {
      const req = {};
      const res = {};
      sinon.stub(productsServices, 'listAll').resolves({ type: null, message: productsList });
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();
      await productsControllers.listProducts(req, res);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith(productsList);
    });
    it('should return an error if the database returns undefined', async function () {
      const req = {};
      const res = {};
      sinon.stub(productsServices, 'listAll').resolves({ type: NOT_FOUND_STATUS, message: PRODUCT_NOT_FOUND });
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();
      await productsControllers.listProducts(req, res);

      expect(res.status).to.have.been.calledWith(NOT_FOUND_STATUS);
      expect(res.json).to.have.been.calledWith(PRODUCT_NOT_FOUND);
    });
  });
  describe('The searchProducts service should resolve coherent requests', function () {
    afterEach(sinon.restore);
    it('should return all products in an object array with id and product name', async function () {
      const req = { query: { q: 'Mar' } };
      const res = {};
      sinon.stub(productsServices, 'listByName').resolves({
        type: null, message: [{
          id: 1,
          name: "Martelo de Thor"
        }]
      });
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();
      await productsControllers.searchProducts(req, res);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith([{ id: 1, name: 'Martelo de Thor' }]);
    });
    it('should return  error if has no query', async function () {
      const req = { query: { q: null } };
      const res = {};
      sinon.stub(productsServices, 'listAll').resolves({
        type: null, message: [
          { id: 1, name: 'Martelo de Thor' },
          { id: 2, name: 'Traje de encolhimento' },
          { id: 3, name: 'Escudo do Capitão América' }
        ]
      });
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();
      await productsControllers.searchProducts(req, res);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith([
        { id: 1, name: 'Martelo de Thor' },
        { id: 2, name: 'Traje de encolhimento' },
        { id: 3, name: 'Escudo do Capitão América' }
      ]);
    });
    it('should return error if fails to load the db and has no query', async function () {
      const req = { query: { q: null } };
      const res = {};
      sinon.stub(productsServices, 'listAll').resolves({ type: NOT_FOUND_STATUS, message: PRODUCT_NOT_FOUND });
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();
      await productsControllers.searchProducts(req, res);

      expect(res.status).to.have.been.calledWith(NOT_FOUND_STATUS);
      expect(res.json).to.have.been.calledWith(PRODUCT_NOT_FOUND);
    });
    it('should return error if fails to load the db and has query', async function () {
      const req = { query: { q: 'Xablau' } };
      const res = {};
      sinon.stub(productsServices, 'listByName').resolves({ type: NOT_FOUND_STATUS, message: PRODUCT_NOT_FOUND });
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();
      await productsControllers.searchProducts(req, res);

      expect(res.status).to.have.been.calledWith(NOT_FOUND_STATUS);
      expect(res.json).to.have.been.calledWith(PRODUCT_NOT_FOUND);
    });
  });
  describe('The listProductById service should resolve coherent requests', function () {
    afterEach(sinon.restore);
    it('should return all products in an object array with id and product name', async function () {
      const req = { params: { id:1 }};
      const res = {};
      sinon.stub(productsServices, 'listById').resolves({
        type: null, message: [{
          id: 1,
          name: "Martelo de Thor"
        }]
      });
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();
      await productsControllers.listProductById(req, res);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith([{ id: 1, name: 'Martelo de Thor' }]);
    });
    it('should return an error if the given id is invalid', async function () {
      const req = { params: { id: 999 } };
      const res = {};
      sinon.stub(productsServices, 'listById').resolves({ type: NOT_FOUND_STATUS, message: PRODUCT_NOT_FOUND });
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();
      await productsControllers.listProductById(req, res);

      expect(res.status).to.have.been.calledWith(NOT_FOUND_STATUS);
      expect(res.json).to.have.been.calledWith({ message: PRODUCT_NOT_FOUND });
    });
  });
  describe('The createProduct service should resolve coherent requests', function () {
    afterEach(sinon.restore);
    it('should return all products in an object array with id and product name', async function () {
      const req = { body: {
        name: 'Elemento X'
      } };
      const res = {};
      sinon.stub(productsServices, 'insertProduct').resolves({type: null, message: [{ id: 4, name: 'Elemento X' }]});
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();
      await productsControllers.createProduct(req, res);

      expect(res.status).to.have.been.calledWith(201);
      expect(res.json).to.have.been.calledWith([{ id: 4, name: 'Elemento X' }]);
    });
    it('should return all products in an object array with id and product name', async function () {
      const req = {
        body: {
          name: 'Ele'
        }
      };
      const res = {};
      sinon.stub(productsServices, 'insertProduct').resolves({ type: UNPROCESSABLE_ENTITY, message: NAME_TOO_SHORT });
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();
      await productsControllers.createProduct(req, res);

      expect(res.status).to.have.been.calledWith(UNPROCESSABLE_ENTITY);
      expect(res.json).to.have.been.calledWith({ message: NAME_TOO_SHORT });
    });
  });
  describe('The updateProduct service should resolve coherent requests', function () {
    afterEach(sinon.restore);
    it('should return all products in an object array with id and product name', async function () {
      const req = {
        params: { id: 1 },
        body: {
          name: 'Elemento X'
        }
      };
      const res = {};
      sinon.stub(productsServices, 'updateProduct').resolves({ type: null, message: [{ id: 1, name: 'Elemento X' }] });
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();
      await productsControllers.updateProduct(req, res);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith([{ id: 1, name: 'Elemento X' }]);
    });
    it('should return all products in an object array with id and product name', async function () {
      const req = {
        params: { id: 1 },
        body: {
          name: 'Ele'
        }
      };
      const res = {};
      sinon.stub(productsServices, 'updateProduct').resolves({ type: UNPROCESSABLE_ENTITY, message: NAME_TOO_SHORT });
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();
      await productsControllers.updateProduct(req, res);

      expect(res.status).to.have.been.calledWith(UNPROCESSABLE_ENTITY);
      expect(res.json).to.have.been.calledWith({ message: NAME_TOO_SHORT });
    });
    it('should return all products in an object array with id and product name', async function () {
      const req = {
        params: { id: 999 },
        body: {
          name: 'Elemento X'
        }
      };
      const res = {};
      sinon.stub(productsServices, 'updateProduct').resolves({ type: NOT_FOUND_STATUS, message: PRODUCT_NOT_FOUND });
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns();
      await productsControllers.updateProduct(req, res);

      expect(res.status).to.have.been.calledWith(NOT_FOUND_STATUS);
      expect(res.json).to.have.been.calledWith({ message: PRODUCT_NOT_FOUND });
    });
  });
  describe('The updateProduct service should resolve coherent requests', function () {
    afterEach(sinon.restore);
    it('should return all products in an object array with id and product name', async function () {
      const req = {
        params: { id: 1 },
      };
      const res = {};
      sinon.stub(productsServices, 'removeProduct').resolves({ type: null, message: '' });
      res.status = sinon.stub().returns(res);
      res.end = sinon.stub().returns();
      await productsControllers.deleteProduct(req, res);

      expect(res.status).to.have.been.calledWith(204);
      expect(res.end).to.have.been.calledWith();
    });
  });
});