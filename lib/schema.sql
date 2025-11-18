-- Create the measurements table
CREATE TABLE IF NOT EXISTS measurements (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  leg_length DECIMAL(10, 2) NOT NULL,
  height_90_degree DECIMAL(10, 2) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on user_email for faster queries
CREATE INDEX IF NOT EXISTS idx_measurements_user_email ON measurements(user_email);

-- Create an index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_measurements_created_at ON measurements(created_at DESC);

