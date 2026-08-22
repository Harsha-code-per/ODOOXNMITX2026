# Use official lightweight Python image
FROM python:3.12-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8000

# Install uv package manager from official image
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

# Set working directory
WORKDIR /app

# Copy dependency definition files
COPY pyproject.toml uv.lock ./

# Install python dependencies using uv
RUN uv sync --frozen --no-dev

# Copy application source and Alembic migrations
COPY alembic.ini ./
COPY alembic/ ./alembic/
COPY app/ ./app/

# Expose backend API port
EXPOSE 8000

# Health check using Python's built-in urllib
HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:' + str(__import__('os').getenv('PORT', 8000)) + '/health')" || exit 1

# Start container: run migrations then start production uvicorn server
CMD ["sh", "-c", "uv run alembic upgrade head && uv run uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
