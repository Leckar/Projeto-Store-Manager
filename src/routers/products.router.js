const express = require('express');
const { productsControllers } = require('../controllers');
const { validateName } = require('../middlewares');

const router = express.Router();

router.get('/search', productsControllers.searchProducts);
router.get('/', productsControllers.listProducts);
router.get('/:id', productsControllers.listProductById);
router.post('/',
  validateName,
  productsControllers.createProduct);
router.put('/:id',
  validateName,
  productsControllers.updateProduct);
router.delete('/:id', productsControllers.deleteProduct);

module.exports = router;