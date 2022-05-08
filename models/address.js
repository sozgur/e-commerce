"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");

/** Related functions for addresses. */

class Address {
    /** create a address (from data) return new address data.
     *
     * Returns { id, title, firstName, lastName, address1, address2, city,
     *   state, zip, phone}
     **/

    static async create({
        title,
        firstName,
        lastName,
        address1,
        address2,
        city,
        state,
        zip,
        phone,
    }) {
        const result = await db.query(
            `INSERT INTO addresses
           (title,
            first_name,
            last_name,
            address1,
            address2,
            city,
            state,
            zip,
            phone)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           RETURNING id, title, first_name AS "firstName", last_name AS "lastName", address1, address2, city, state, zip, phone`,
            [
                title,
                firstName,
                lastName,
                address1,
                address2,
                city,
                state,
                zip,
                phone,
            ]
        );
        const address = result.rows[0];
        return address;
    }

    /** Given a address id, return data about address.
     *
     * Returns { title, firstName, lastName, address1, address2, city,
     *   state, zip, phone} }
     *
     * Throws NotFoundError if not found.
     */
    static async get(id) {
        const result = await db.query(
            ` SELECT title, first_name AS "firstName", last_name AS "lastName", address1, address2, city, state, zip, phone
              FROM addresses
              WHERE id = $1`,
            [id]
        );

        const address = result.rows[0];
        if (!address) throw new NotFoundError(`No address: ${id}`);
        return address;
    }

    /** Add relation user to address; returns undefined. */

    static async associate(user_id, address_id) {
        const result = await db.query(
            `INSERT INTO user_addresses
            (user_id, address_id) 
            VALUES ($1, $2)`,
            [user_id, address_id]
        );
    }

    /** Delete given address from database; returns undefined. */
    static async remove(id) {
        let result = await db.query(
            `DELETE
           FROM addresses
           WHERE id = $1
           RETURNING id`,
            [id]
        );
        const address = result.rows[0];

        if (!address) throw new NotFoundError(`No user: ${address}`);
    }
}
