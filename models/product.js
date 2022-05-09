"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");

/** Related functions for products */

class Product {
    /** create a product (from data) return new product data.
     *
     * Returns { id, title, description, visibility, price, inventory}
     **/

    static async create({ title, description, visibility, price, inventory }) {
        const result = await db.query(
            `INSERT INTO products
           (title, description, visibility, price, inventory)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING id, title, description, visibility, price, inventory`,
            [title, description, visibility, price, inventory]
        );
        const product = result.rows[0];
        return product;
    }

    /** Find all prodocts. (search filter is optional)
     *
     * Can apply filters
     * - title (case-insensitive)
     * - minPrice
     * - maxPrice
     *
     * Returns [{ id, title, description, visibility, price, inventory }, ...]
     * */
    static async findAll(
        searchFilters = { title: null, minPrice: null, maxPrice: null }
    ) {
        let sql = [
            `SELECT id, title, description, visibility, price, inventory
       FROM products
       WHERE 1=1`,
        ];
        let values = [];
        let idx = 1;

        if (
            searchFilters.minPrice &&
            searchFilters.maxPrice &&
            searchFilters.maxPrice <= searchFilters.minPrice
        ) {
            throw new BadRequestError(
                "maxEmployees can't smaller than minEmployees"
            );
        }

        if (searchFilters.title) {
            sql.push(`AND title ILIKE $${idx++}`);
            values.push(`%${searchFilters.title}%`);
        }
        if (searchFilters.minPrice) {
            sql.push(`AND price >= $${idx++}`);
            values.push(searchFilters.minPrice);
        }
        if (searchFilters.maxPrice) {
            sql.push(`AND price <= $${idx++}`);
            values.push(searchFilters.maxPrice);
        }
        sql.push(`ORDER BY id DESC`);

        const products = await db.query(sql.join(" "), values);

        return product.rows.map((r) => {
            return {
                id: r.id,
                title: r.title,
                description: r.description,
                visibility: r.visibility,
                price: r.price,
                inventory: r.inventory,
            };
        });
    }

    /** Given a product id, return data about product.
     *
     * Returns { id, title, description, visibility, price, inventory} }
     *
     * Throws NotFoundError if not found.
     */
    static async get(id) {
        const result = await db.query(
            ` SELECT id, title, description, visibility, price, inventory
              FROM products
              WHERE id = $1`,
            [id]
        );

        const product = result.rows[0];
        if (!product) throw new NotFoundError(`No product: ${id}`);
        return product;
    }

    /** Delete given product from database; returns undefined. */
    static async remove(id) {
        let result = await db.query(
            `DELETE
           FROM products
           WHERE id = $1
           RETURNING id`,
            [id]
        );
        const product = result.rows[0];

        if (!product) throw new NotFoundError(`No product: ${product}`);
    }
}
