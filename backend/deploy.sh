#!/bin/bash
set -e

echo "🚀 Starting deployment..."

# Navigate to backend directory
cd "$(dirname "$0")"

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --production

# Build the project
echo "🔨 Building project..."
npm run build

# Run database migrations
echo "🗄️  Running database migrations..."
npm run db:migrate

# Restart PM2 process
echo "🔄 Restarting application..."
pm2 restart ecosystem.config.js --update-env || pm2 start ecosystem.config.js

echo "✅ Deployment complete!"

