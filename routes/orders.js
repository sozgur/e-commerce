"use strict";

/** Routes for companies. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureLoggedIn } = require("../middleware/auth");
const orderStartSchema = require("../schemas/orderStart.json");

const router = new express.Router();

/** POST / { order } =>  { order }
 *
 * order should be { shipping_address_id, user_id }
 *
 * Returns { id, shipping_address_id, user_id, status }
 */

router.post("/", ensureLoggedIn, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, orderStartSchema);
        if (!validator.valid) {
            const errs = validator.errors.map((e) => e.stack);
            throw new BadRequestError(errs);
        }

        const order = await Order.start(req.body);
        return res.status(201).json({ order });
    } catch (err) {
        return next(err);
    }
});

/** POST / { order_id } =>  { product_order }
 *
 * Add product under same order id. Using like cart
 *
 */

router.post("/:id", ensureLoggedIn, async function (req, res, next) {
    try {
        const product_order = await Order.add_product(
            res.params.id,
            res.body.product_id,
            res.body.quantity
        );
        return res.status(201).json({ product_order });
    } catch (err) {
        return next(err);
    }
});

/** GET /[order_id] => { total_amount }
 *
 * Returns { total_amount }
 *
 * Authorization required: login
 **/

router.get("/:id", ensureLoggedIn, async function (req, res, next) {
    try {
        const total_amount = await Order.calculate_amount(req.params.id);
        return res.json({ total_amount });
    } catch (err) {
        return next(err);
    }
});

/** DELETE /[id]  =>  { id, status }
 *
 */

router.delete("/:id", ensureLoggedIn, async function (req, res, next) {
    try {
        const order = await Order.cancel(req.params.id);
        return res.json({ order });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
