"use strict";

/** Routes for addresses. */

const jsonschema = require("jsonschema");
const express = require("express");
const { ensureOwnAccountOrAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const Address = require("../models/user");
const addressNewSchema = require("../schemas/addressNew.json");

const router = express.Router();

/** POST / { address, user_id }  => { address }
 *
 * Adds a new address.
 *
 * This returns the newly created address:
 *  {id, title, firstName, lastName, address1, address2, city, state, zip, phone }
 *
 * Authorization required: login or admin can create for other user
 **/

router.post("/", ensureOwnAccountOrAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, addressNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const address = await Address.register(req.body);
    const relation = await Address.associate(address.id, req.body.user_id);
    return res.status(201).json({ address });
  } catch (err) {
    return next(err);
  }
});

/** GET /[id] => { address }
 *
 * Returns {id, title, firstName, lastName, address1, address2, city, state, zip, phone }
 *
 * Authorization required: login or admin can create for other user
 **/

router.get("/:id", ensureOwnAccountOrAdmin, async function (req, res, next) {
  try {
    const address = await Address.get(req.params.id);
    return res.json({ address });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[id]  =>  { deleted: id }
 *
 * Authorization required: login or admin can create for other user
 **/

router.delete("/:id", ensureOwnAccountOrAdmin, async function (req, res, next) {
  try {
    await Address.remove(req.params.id);
    return res.json({ deleted: req.params.id });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
