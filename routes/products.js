"use strict";

/** Routes for companies. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureAdmin } = require("../middleware/auth");
const Product = require("../models/product");

const productNewSchema = require("../schemas/productNew.json");
const router = new express.Router();

/** POST / { product } =>  { product }
 *
 * product should be { title, description, visibility, price, inventory }
 *
 * Returns { id, title, description, visibility, price, inventory }
 *
 * Authorization required: login as a admin
 */

router.post("/", ensureAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, productNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const product = await Product.create(req.body);
    return res.status(201).json({ product });
  } catch (err) {
    return next(err);
  }
});

/** GET /  =>
 *   { products: [ { id, title, description, visibility, price, inventory }, ...] }
 *
 * Can filter on provided search filters:
 * - title (case-insensitive)
 * - minPrice
 * - maxPrice
 *
 * Authorization required: none
 */

router.get("/", async function (req, res, next) {
  try {
    let searchFilters = req.query;
    const products = await Product.findAll(searchFilters);
    return res.json({ products });
  } catch (err) {
    return next(err);
  }
});

/** GET /[handle]  =>  { product }
 *
 *  Product is { id, title, description, visibility, price, inventory }
 *
 * Authorization required: none
 */

router.get("/:id", async function (req, res, next) {
  try {
    const product = await Product.get(req.params.id);
    return res.json({ product });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[id]  =>  { deleted: id }
 *
 * Authorization: login as a admin
 */

router.delete("/:id", ensureAdmin, async function (req, res, next) {
  try {
    await Product.remove(req.params.id);
    return res.json({ deleted: req.params.id });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
