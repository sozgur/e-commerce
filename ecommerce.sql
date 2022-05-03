\echo 'Delete and recreate ecommerce db?'
\prompt 'Return for yes or control-D to cancel > ' foo

DROP DATABASE ecommerce;
CREATE DATABASE ecommerce;
\connect ecommerce

\i ecommerce-schema.sql
\i ecommerce-seed.sql

\echo 'Delete and recreate ecommerce_test db?'
\prompt 'Return for yes or control-D to cancel > ' foo

DROP DATABASE ecommerce_test;
CREATE DATABASE ecommerce_test;
\connect ecommerce_test

\i ecommerce-schema.sql