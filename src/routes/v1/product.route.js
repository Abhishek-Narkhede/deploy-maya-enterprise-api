const express = require('express');
const validate = require('../../middlewares/validate');
const productValidation = require('../../modules/products/validation');
const productController = require('../../modules/products/controller/product.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/add', validate(productValidation.addProduct), productController.addProductController);
router.post('/add-product-information', auth('manageProducts'), validate(productValidation.addProductInformation), productController.addProductInformationController);
router.put('/update-product-information/:id', auth('manageProducts'), validate(productValidation.updateProductInformation), productController.updateProductInformationController);
router.put('/delete-product-information/:id', auth('manageProducts'), validate(productValidation.deleteProductInformation), productController.deleteProductInformationController);
router.get('/get-all-product-information', productController.getAllProductInformationController);
router.get('/get-product-information/:id', validate(productValidation.getProductInformationById), productController.getProductInformationByIdController);
router.get('/get-product-information-by-product/:id', validate(productValidation.getProductInformationByProductId), productController.getProductInformationByProductIdController);
router.post('/getAllProducts', productController.getAllProducts);
router.post('/getAllProductsOfNoOrderItem', productController.getProductsOfNoOredrItems);
router.post('/getProductsByBrandId/:id', productController.getProductsByBrandId);
// router.get('/getProductCategoriesById/:id', productController.getProductCategoriesById);
router.get('/getTopRatedProducts', productController.getTopRatedProducts);
router.get('/getProductsBasedOnCategories', productController.getProductsBasedOnCategories);
router.post('/globalSearchProducts', productController.globalSearchProducts);
router.put('/update-discounted-price/:id', auth('manageProducts'), productController.updateDiscountedPrice);
router.get('/get-product-details-information-by-product/:id', productController.getProductDetailsAndInformationByProductId);

// for admin
router.put('/delete-product/:id', productController.deleteProductById);
router.get('/get-product/:id', productController.getProductById);
router.put('/update-product/:id', productController.updateProductById);
router.put('/update-product-field', productController.addFieldToAllProducts);


module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication
 */

/**
 * @swagger
 * /auth/regis'ter:
 *   post:
 *     summary: Register as user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *                 description: must be unique
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: At least one number and one letter
 *             example:
 *               name: fake name
 *               email: fake@example.com
 *               password: password1
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 tokens:
 *                   $ref: '#/components/schemas/AuthTokens'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *             example:
 *               email: fake@example.com
 *               password: password1
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 tokens:
 *                   $ref: '#/components/schemas/AuthTokens'
 *       "401":
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 401
 *               message: Invalid email or password
 */

