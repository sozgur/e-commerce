"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");

/** Related functions for orders */

class Order {
    /** start a order.
     *
     * Returns { id, shipping_address_id, user_id, status }
     **/

    static async start({ shipping_address_id, user_id }) {
        const result = await db.query(
            `INSERT INTO orders
           (shipping_address_id, user_id, status)
           VALUES ($1, $2, $3)
           RETURNING id, shipping_address_id, user_id, status`,
            [shipping_address_id, user_id, "start"]
        );
        const order = result.rows[0];
        return order;
    }

    static async add_product(order_id, product_id, quantity) {
        const result = await db.query(
            `INSERT INTO product_orders
           (order_id, product_id, quantity)
           VALUES ($1, $2, $3)
           RETURNING order_id, product_id, quantity`,
            [order_id, product_id, quantity]
        );
        const product_order = result.rows[0];
        return product_order;
    }

    /** Change status of a order
     *
     * Returns { id, status} }
     *
     * Throws NotFoundError if not found.
     */
    static async change_status(id, to_status) {
        let result = await db.query(
            `UPDATE orders
           SET status = $1
           WHERE id = $2
           RETURNING id, status`,
            [to_status, id]
        );

        const order = result.rows[0];
        if (!order) throw new NotFoundError(`No order: ${id}`);
        return { id: order.id, status: status };
    }

    static async calculate_amount(order_id) {
        const amount = await db.query(
            `SELECT SUM(p.price * po.quantity)
              FROM product_orders AS po
              JOIN products AS p ON p.id = po.product_id
              WHERE po.id = $1`,
            [order_id]
        );
        const amount = result.rows[0];

        return { total_amount: amount };
    }

    /** Cancel a order; returns id, status. */
    static async cancel(id) {
        let result = await db.query(
            `UPDATE orders
           SET status = $1
           WHERE id = $2
           RETURNING id, status`,
            ["cancel", id]
        );

        await db.query(
            `DELETE
           FROM product_orders
           WHERE order_id = $1`,
            [id]
        );

        const order = result.rows[0];

        if (!order) throw new NotFoundError(`No order: ${order}`);

        return { id: order.id, status: status };
    }
}
