#!/bin/bash

echo "🚀 Setting up Cloudflare Workers Backend with Drizzle ORM and NeonDB"
echo "================================================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "📦 Installing Wrangler CLI..."
    npm install -g wrangler
fi

echo "📦 Installing dependencies..."
npm install

echo "🔐 Setting up environment variables..."
echo ""
echo "Please update the following files with your configuration:"
echo ""
echo "1. wrangler.toml - Add your environment variables:"
echo "   - DATABASE_URL (NeonDB connection string)"
echo "   - CLERK_JWT_KEY (from Clerk dashboard)"
echo "   - CLERK_PUBLISHABLE_KEY (from Clerk dashboard)"
echo ""
echo "2. Create a .env file for local development:"
echo "   DATABASE_URL=your_neon_db_connection_string"
echo "   CLERK_JWT_KEY=your_clerk_jwt_key"
echo "   CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file template..."
    cat > .env << EOF
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# Clerk Configuration
CLERK_JWT_KEY="your_jwt_key_here"
CLERK_PUBLISHABLE_KEY="your_publishable_key_here"
EOF
    echo "✅ Created .env file template. Please update it with your actual values."
fi

echo "🗄️  Database setup instructions:"
echo ""
echo "1. Create a NeonDB account at https://neon.tech"
echo "2. Create a new project"
echo "3. Get your connection string"
echo "4. Update DATABASE_URL in wrangler.toml and .env"
echo "5. Run: npm run db:push"
echo ""

echo "🚀 Deployment instructions:"
echo ""
echo "1. Login to Cloudflare: wrangler login"
echo "2. Deploy to development: npm run deploy"
echo "3. Deploy to staging: npm run deploy:staging"
echo "4. Deploy to production: npm run deploy:prod"
echo ""

echo "🧪 Testing instructions:"
echo ""
echo "1. Start local development: npm run dev"
echo "2. Open Drizzle Studio: npm run db:studio"
echo "3. View logs: wrangler tail"
echo ""

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update environment variables in wrangler.toml and .env"
echo "2. Set up your NeonDB database"
echo "3. Run database migrations"
echo "4. Test locally with npm run dev"
echo "5. Deploy to Cloudflare Workers"
echo ""
echo "📚 Documentation:"
echo "- Backend README: README.md"
echo "- Migration Summary: ../MIGRATION_SUMMARY.md"
echo "- Frontend Migration Guide: ../FRONTEND_MIGRATION_GUIDE.md"
