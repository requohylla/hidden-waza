-- +goose Up
CREATE TABLE IF NOT EXISTS skills (
    id SERIAL PRIMARY KEY,
    resume_id INTEGER NOT NULL REFERENCES resumes(id),
    type VARCHAR(32) NOT NULL,
    master_id INTEGER NOT NULL,
    level VARCHAR(32),
    years INTEGER
);

-- +goose Down
DROP TABLE IF EXISTS skills;