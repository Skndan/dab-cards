# Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Keycloak Authentication
NEXT_PUBLIC_KEYCLOAK_URL=https://your-keycloak-url.com
NEXT_PUBLIC_KEYCLOAK_REALM=your-realm
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=your-client-id
# KEYCLOAK_CLIENT_SECRET=your-client-secret

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database
POSTGRES_URL=postgresql://user:password@localhost:5432/ai_business_cards

# Redis (for background jobs)
REDIS_URL=redis://localhost:6379

# AI
OPENAI_API_KEY=your-openai-api-key
GROQ_API_KEY=your-groq-api-key
PERPLEXITY_API_KEY=your-perplexity-api-key

# Integrations
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
MICROSOFT_CLIENT_ID=your-microsoft-client-id
MICROSOFT_CLIENT_SECRET=your-microsoft-client-secret
NOTION_CLIENT_ID=your-notion-client-id
NOTION_CLIENT_SECRET=your-notion-client-secret

# Billing (Dodopayments)
DODOPAYMENTS_API_KEY=your-dodopayments-api-key
DODOPAYMENTS_SECRET_KEY=your-dodopayments-secret-key
DODOPAYMENTS_WEBHOOK_SECRET=your-webhook-secret

# Object Storage (RustFS - S3 compatible)
RUSTFS_ENDPOINT=https://your-rustfs-endpoint.com
RUSTFS_ACCESS_KEY=your-access-key
RUSTFS_SECRET_KEY=your-secret-key
RUSTFS_BUCKET_NAME=ai-business-cards
RUSTFS_REGION=us-east-1
```

