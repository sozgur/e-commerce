-- both test users have the password "password"

INSERT INTO users (username, password, first_name, last_name, email, is_admin)
VALUES ('testuser',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test',
        'User',
        'joe.user@smith.com',
        FALSE),
       ('testadmin',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test',
        'Admin!',
        'joe.admin@smith.com',
        TRUE);

INSERT INTO addresses (title, first_name, last_name, address1, address2, city, state, zip, phone)
VALUES ('testuseraddress',
        'Test',
        'User',
        '122 North Dr.',
        '',
        'Sunnyvale',
        'CA',
        '123456',
        '4561233212');

INSERT INTO user_addresses (user_id, address_id)
VALUES (1,1);