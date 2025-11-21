#!/bin/bash
# Database Setup Script for Tochigi Platform
# This script sets up PostgreSQL and seeds the database with initial data

set -e

echo "🚀 Tochigi Platform Database Setup"
echo "==================================="

# Check if PostgreSQL is installed
if command -v psql &> /dev/null; then
    echo "✅ PostgreSQL is installed"
elif command -v docker &> /dev/null; then
    echo "✅ Docker is available - using Docker Compose"
    docker-compose up -d postgres
    echo "⏳ Waiting for PostgreSQL to be ready..."
    sleep 10
else
    echo "❌ Neither PostgreSQL nor Docker is installed"
    echo "Please install one of the following:"
    echo "  - PostgreSQL: brew install postgresql@14"
    echo "  - Docker: https://www.docker.com/get-started"
    exit 1
fi

# Push Prisma schema to database
echo "📊 Pushing Prisma schema to database..."
npm run db:push

# Seed the database with initial data
echo "🌱 Seeding database with initial data..."
echo "   - 18 construction categories"
echo "   - Sample companies with Instagram posts"
npm run db:seed

echo "✅ Database setup complete!"
echo ""
echo "You can now run: npm run dev"
