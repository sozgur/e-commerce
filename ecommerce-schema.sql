CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(30) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email TEXT UNIQUE NOT NULL
    CHECK (position('@' IN email) > 1),
  is_admin BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE addresses (
  id SERIAL PRIMARY KEY,
  title VARCHAR(50) NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  address1 VARCHAR(150) NOT NULL,
  address2 VARCHAR(150),
  city VARCHAR(50) NOT NULL,
  state VARCHAR(30) NOT NULL,
  zip VARCHAR(30) NOT NULL,
  phone TEXT NOT NULL
);

CREATE TABLE user_addresses (
  user_id INTEGER
    REFERENCES users ON DELETE CASCADE,
  address_id INTEGER
    REFERENCES addresses ON DELETE CASCADE,
  PRIMARY KEY (user_id, address_id)
);

CREATE TYPE order_status AS ENUM ('paid','shipped','delivered');
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER
    REFERENCES users ON DELETE CASCADE,
  shipping_address_id INTEGER
    REFERENCES addresses ON DELETE CASCADE,
  status order_status
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  visibility BOOLEAN NOT NULL DEFAULT FALSE,
  price NUMERIC NOT NULL CHECK (price > 0),
  inventory INTEGER NOT NULL
);

CREATE TABLE product_orders (
  order_id INTEGER
    REFERENCES orders ON DELETE CASCADE,
  product_id INTEGER
    REFERENCES products ON DELETE CASCADE,
  PRIMARY KEY (order_id, product_id),
  quantity INTEGER NOT NULL
);

CREATE TYPE payment_status AS ENUM ('processing','completed','failed');
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  amount NUMERIC NOT NULL CHECK (amount > 0),
  order_id INTEGER
    REFERENCES orders ON DELETE CASCADE,
  billing_address_id INTEGER
    REFERENCES addresses ON DELETE CASCADE,
  status payment_status,
  currency VARCHAR(20) NOT NULL,
  created_at TIMESTAMP NOT NULL
);
