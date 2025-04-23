import { ProductService } from "../app/exercise/ej2";
describe("Test on ej2 component", () => {
  const date = Date.now();
  let storage = {
    products_cache: '{"a":"A","b":"B"}',
    products_cache_timestamp: date.toString(),
    favorite_products: '["1","2","3"]',
  };
  const localStorageMock = {
    getItem: (
      key: "products_cache" | "products_cache_timestamp" | "favorite_products"
    ) => {
      return storage[key];
    },
    setItem: (
      key: "products_cache" | "products_cache_timestamp" | "favorite_products",
      value: String
    ) => {
      storage = { ...storage, [key]: value };
    },
    removeItem: jest.fn(),
    clear: jest.fn(),
    length: 10,
    key: () => {
      return "some";
    },
  };
  let responseState = "fail";
  const fetchMock = () => {
    return new Promise<any>((resolve, reject) => {
      responseState === "success"
        ? resolve({
            ok: true,
            status: "200",
            json: () => {
              return { c: "C", b: "B", a: "A" };
            },
          })
        : resolve({ ok: false, status: "500", json: () => {} });
    });
  };
  global.localStorage = localStorageMock;
  global.fetch = fetchMock;

  test("Should call getProducts method and return products from localStorage", async () => {
    const instance = new ProductService();
    const products = await instance.getProducts();
    expect(products).toEqual({ a: "A", b: "B" });
  });
  test("Should call getProducts method with a fail response", async () => {
    try {
      storage.products_cache = "";
      const instance = new ProductService();
      await instance.getProducts();
    } catch (error) {
      expect(error).toEqual(Error("HTTP error! status: 500"));
    }
  });
  test("Should call getProducts method with a success response", async () => {
    storage.products_cache = "";
    responseState = "success";
    const instance = new ProductService();
    const products = await instance.getProducts();
    expect(products).toEqual({ c: "C", b: "B", a: "A" });
  });
  test("Should call getProductDetails method with a fail response", async () => {
    try {
      responseState = "fail";
      const instance = new ProductService();
      await instance.getProductDetails("5");
    } catch (error) {
      expect(error).toEqual(Error(`HTTP error! status: 500`));
    }
  });
  test("Should call getProductDetails method with a success response", async () => {
    responseState = "success";
    const instance = new ProductService();
    await instance.getProductDetails("5");
  });
  test("Should call addProductToFavorites method", async () => {
    const instance = new ProductService();
    await instance.addProductToFavorites("5");
    expect(storage.favorite_products).toEqual(
      JSON.stringify(["1", "2", "3", "5"])
    );
  });
  test("Should call getFavoriteProducts method", async () => {
    const instance = new ProductService();
    const favoriteProducts = await instance.getFavoriteProducts();
    expect(favoriteProducts).toEqual(["1", "2", "3", "5"]);
  });
  test("Should call addProductToFavorites method with favorite products empty", async () => {
    storage.favorite_products = "";
    const instance = new ProductService();
    const product = await instance.addProductToFavorites("5");
    expect(storage.favorite_products).toEqual(JSON.stringify(["5"]));
  });
  test("Should call getFavoriteProducts method with favorite products empty", async () => {
    storage.favorite_products = "";
    const instance = new ProductService();
    const favoriteProducts = await instance.getFavoriteProducts();
    expect(favoriteProducts).toEqual([]);
  });
});
