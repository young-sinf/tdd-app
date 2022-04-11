const productController = require("../../controller/products");
const ProductModel = require("../../models/Products");
const httpMocks = require("node-mocks-http");
const newProduct = require("../data/new-product.json");
const products = require("../data/products.json");

// 해당 함수를 mock 함수로
ProductModel.create = jest.fn();
ProductModel.find = jest.fn();

let req, res, next;

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

describe("Product Controller Read", () => {
  it("should have a getProducts function", () => {
    expect(typeof productController.getProducts).toEqual("function");
  });

  it("shoud call Product.find", async () => {
    await productController.getProducts(req, res, next);
    expect(ProductModel.find).toBeCalled();
  });

  it("should return 200 response code", async () => {
    await productController.getProducts(req, res, next);
    expect(res.statusCode).toEqual(200);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it("should return json body in response", async () => {
    ProductModel.find.mockReturnValue(products);
    await productController.getProducts(req, res, next);
    expect(res._getJSONData()).toStrictEqual(products);
  });
});

describe("Product Controller Create", () => {
  beforeEach(() => {
    req.body = newProduct;
  });

  it("should have a createProduct function", () => {
    expect(typeof productController.createProduct).toBe("function");
  });

  it("should call Product.create", async () => {
    req.body = newProduct;
    await productController.createProduct(req, res, next);
    expect(ProductModel.create).toBeCalledWith(newProduct);
  });

  it("should return 201 response code", async () => {
    await productController.createProduct(req, res, next);
    expect(res.statusCode).toBe(201);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it("should return json body in response", async () => {
    // mock 함수에 리턴 값을 임의로 지정해줌
    ProductModel.create.mockReturnValue(newProduct);
    await productController.createProduct(req, res, next);
    expect(res._getJSONData()).toStrictEqual(newProduct);
  });

  it("should handle errors", async () => {
    const errorMessage = { message: "description property missing" };
    const rejectedPromise = Promise.reject(errorMessage);
    ProductModel.create.mockReturnValue(rejectedPromise);
    await productController.createProduct(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});
