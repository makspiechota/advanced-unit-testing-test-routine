-- Initialize database schema for user registration exercise

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Insert some test data (optional)
-- This can be useful for manual testing
INSERT INTO users (email, name, password_hash)
VALUES ('existing@example.com', 'Existing User', 'hashed_password_123')
ON CONFLICT (email) DO NOTHING;
