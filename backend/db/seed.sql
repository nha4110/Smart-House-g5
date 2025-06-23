-- Create a test table
CREATE TABLE IF NOT EXISTS test_table (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    score INTEGER
);

-- Insert some sample rows
INSERT INTO test_table (name, score) VALUES
('Alice', 90),
('Bob', 75),
('Charlie', 88);
