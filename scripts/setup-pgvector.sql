-- Enable pgvector extension (requires superuser or rds_superuser)
-- Run this manually on your database before migrations
CREATE EXTENSION IF NOT EXISTS vector;

-- Verify extension is installed
SELECT * FROM pg_extension WHERE extname = 'vector';
