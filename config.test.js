"use strict";

describe("config can come from env", function () {
  test("works", function () {
    process.env.SECRET_KEY = "abcdf";
    process.env.PORT = "5000";
    process.env.DATABASE_URL = "other";
    process.env.NODE_ENV = "other";

    const config = require("./config");
    expect(config.SECRET_KEY).toEqual("abcdf");
    expect(config.PORT).toEqual(5000);
    expect(config.getDatabaseUri()).toEqual("other");
    expect(config.BCRYPT_WORK_FACTOR).toEqual(12);

    delete process.env.SECRET_KEY;
    delete process.env.PORT;
    delete process.env.BCRYPT_WORK_FACTOR;
    delete process.env.DATABASE_URL;

    expect(config.getDatabaseUri()).toEqual("ecommerce");
    process.env.NODE_ENV = "test";

    expect(config.getDatabaseUri()).toEqual("ecommerce_test");
  });
});
