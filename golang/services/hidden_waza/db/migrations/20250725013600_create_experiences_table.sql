-- +goose Up
CREATE TABLE IF NOT EXISTS experiences (
    id SERIAL PRIMARY KEY,
    resume_id INTEGER NOT NULL REFERENCES resumes(id),
    company VARCHAR(255),
    position VARCHAR(255),
    start_date DATE,
    end_date DATE,
    description TEXT,
    portfolio_url VARCHAR(255)
);

-- +goose Down
DROP TABLE IF EXISTS experiences;