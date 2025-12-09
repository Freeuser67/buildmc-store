# Discord OAuth Configuration

## Credentials (Stored as Secrets)

The Discord OAuth credentials are stored securely as environment secrets:

- **DISCORD_CLIENT_ID**: `1313798839211393025`
- **DISCORD_CLIENT_SECRET**: Stored securely (never commit to code)

## Setup Status

⚠️ **Note**: Discord OAuth is configured in the secrets, but Lovable Cloud backend does not yet support enabling Discord as an auth provider through its UI.

The Discord login button is implemented and ready. Once Lovable Cloud adds Discord OAuth support in the auth settings, you'll need to:

1. Go to Lovable Cloud Backend → Users → Auth Settings
2. Enable Discord provider
3. The credentials are already saved as secrets

## Discord Developer Portal Settings

In your Discord Application settings, ensure:

- **Redirects**: Add your site URL (e.g., `https://your-project.lovableproject.com/`)
- **OAuth2 Scopes**: `identify`, `email`

## Current Implementation

- Discord login button: ✅ Added to `/auth` page
- Secrets configured: ✅ DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET
- Backend provider enabled: ❌ Waiting for Lovable Cloud support
