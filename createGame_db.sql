-- # create database script for Game Town

-- # create the database 
CREATE DATABASE IF NOT EXISTS game_town;
USE game_town;

-- # create the table for games
CREATE TABLE IF NOT EXISTS games (
    id iNT AUTO_INCREMENT,
    name VARCHAR(50),
    price DECIMAL(5, 2) unsigned,
    PRIMARY KEY(id)
);

-- # insert a game
INSERT INTO games (name, price)
VALUES
    ('Overwatch', 60),
    ('Valorant', 0),
    ('Minecraft', 19.99),
    ('The last of us', 15.99),
    ('Fornite', 0),
    ('It takes two', 34.99),
    ('Marvels Spider-man', 49.55),
    ('Call of Duty: Black Ops 6', 53.99);


-- # create the tables for players details
CREATE TABLE IF NOT EXISTS players (
    id INT AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    hashedPassword VARCHAR(255) NOT NULL,
    PRIMARY KEY(id)
);

-- # create the app user
CREATE USER IF NOT EXISTS 'game_town_app'@'localhost' IDENTIFIED BY 'qwertyuiop'; 
GRANT ALL PRIVILEGES ON game_town.* TO 'game_town_app'@'localhost';
