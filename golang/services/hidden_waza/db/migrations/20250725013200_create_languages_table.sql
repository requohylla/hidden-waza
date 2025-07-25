-- +goose Up
CREATE TABLE IF NOT EXISTS languages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- +goose Down
DROP TABLE IF EXISTS languages;