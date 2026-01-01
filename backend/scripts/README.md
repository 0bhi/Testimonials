# Backend Scripts

This directory contains utility scripts for the backend.

## validate-env.ts

Validates that all required environment variables are properly configured.

### Usage

```bash
npm run validate-env
```

Or directly:

```bash
tsx scripts/validate-env.ts
```

### What it does

- ✅ Checks all required environment variables are set
- ✅ Validates data types (e.g., PORT must be a valid number)
- ✅ Warns about weak secrets (JWT_SECRET length)
- ✅ Displays a configuration summary

### Use Cases

1. **Local Development**: Quickly check your `.env` file is set up correctly
2. **CI/CD Pipelines**: Validate configuration before deployment
3. **Production Debugging**: Verify environment variables are loaded correctly

### Example Output

```
✅ All environment variables are valid!

📋 Configuration Summary:
   Database URL: postgresql://user@host...
   JWT Secret: 43 characters
   Port: 3000
   Environment: development
   Allowed Origin(s): http://localhost:5173

🚀 Ready to start the server!
```

If validation fails, you'll get clear error messages indicating which variables are missing or invalid.

