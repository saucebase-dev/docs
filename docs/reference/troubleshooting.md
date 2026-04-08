# Troubleshooting

This guide covers common issues you might encounter while working with Saucebase and their solutions.

## Installation Issues

### Docker Containers Won't Start

**Symptom**: `docker compose up -d` fails or containers exit immediately

**Solutions**:

```bash
# Check container status
docker compose ps

# View container logs
docker compose logs app
docker compose logs mysql
docker compose logs nginx

# Restart all services
docker compose down
docker compose up -d --wait

# Rebuild containers (if configuration changed)
docker compose down
docker compose build --no-cache
docker compose up -d --wait
```

**Common causes**:
- Port conflicts (3306, 6379, 8025, 80, 443 already in use)
- Insufficient Docker resources (increase memory/CPU in Docker settings)
- Corrupted volumes (remove with `docker compose down -v`)

### MySQL Connection Refused

**Symptom**: `SQLSTATE[HY000] [2002] Connection refused`

**Solution**: Wait for MySQL to be ready (takes 10-30 seconds on first start)

```bash
# Check MySQL status
docker compose ps mysql

# Wait for MySQL to be healthy
docker compose up -d --wait

# View MySQL logs
docker compose logs -f mysql

# Test connection manually
docker compose exec mysql mysql -u root -p
```

### SSL Certificate Errors

**Symptom**: Browser shows "NET::ERR_CERT_AUTHORITY_INVALID"

**Solution**: Trust the self-signed certificate

**macOS**:
```bash
# Trust the certificate
sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain docker/ssl/app.pem
```

**Linux**:
```bash
# Copy certificate to trusted store
sudo cp docker/ssl/app.pem /usr/local/share/ca-certificates/saucebase.crt
sudo update-ca-certificates
```

**Windows**:
- Double-click `docker/ssl/app.pem`
- Click "Install Certificate"
- Select "Local Machine"
- Choose "Place all certificates in the following store" → "Trusted Root Certification Authorities"

### Composer Install Fails

**Symptom**: `composer install` shows errors

**Solutions**:

```bash
# Update Composer to latest version
composer self-update

# Clear Composer cache
composer clear-cache

# Install with verbose output
composer install -vvv

# Skip platform requirements (if using Docker)
composer install --ignore-platform-reqs
```

## Module Issues

### Module Not Found

**Symptom**: `Class 'Modules\Auth\...' not found`

**Solutions**:

```bash
# 1. Check module is enabled
cat modules_statuses.json
# Should show: {"Auth": true}

# 2. Regenerate autoload files
composer dump-autoload

# 3. Clear all caches
php artisan optimize:clear

# 4. Verify module exists
ls -la modules/Auth

# 5. Rebuild frontend assets
npm run build
```

### Module Routes Not Working (404)

**Symptom**: Module routes return 404

**Solutions**:

```bash
# 1. Enable the module
php artisan module:enable Auth

# 2. Clear route cache
php artisan route:clear

# 3. List all routes to verify
php artisan route:list | grep auth

# 4. Check module routes file exists
cat modules/Auth/routes/web.php

# 5. Restart Laravel server
# If using: php artisan serve
# Press Ctrl+C and restart
```

### Module Migrations Not Running

**Symptom**: Module database tables don't exist

**Solutions**:

```bash
# Run module migrations
php artisan module:migrate Auth

# Check migration status
php artisan module:migrate-status Auth

# Refresh migrations (CAUTION: destroys data)
php artisan module:migrate-refresh Auth

# Run specific migration
php artisan migrate --path=modules/Auth/database/migrations
```

### Module Assets Not Loading

**Symptom**: Module CSS/JS not working

**Solutions**:

```bash
# 1. Rebuild frontend assets
npm run build

# 2. Clear Laravel caches
php artisan optimize:clear

# 3. Verify module is enabled
cat modules_statuses.json

# 4. Check module vite.config.js exists
cat modules/Auth/vite.config.js

# 5. Restart Vite dev server
# Press Ctrl+C and run:
npm run dev
```

## Frontend Issues

### Vite Dev Server Won't Start

**Symptom**: `npm run dev` fails

**Solutions**:

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite

# Check for port conflicts (default: 5173)
lsof -i :5173
# Kill process if needed:
kill -9 <PID>

# Run with verbose logging
npm run dev -- --debug
```

### Hot Module Replacement (HMR) Not Working

**Symptom**: Changes don't reflect without full page reload

**Solutions**:

```bash
# 1. Restart Vite dev server
# Press Ctrl+C and run:
npm run dev

# 2. Check VITE_DEV_SERVER_URL in .env
# Should be: VITE_DEV_SERVER_URL=https://localhost:5173

# 3. Clear browser cache
# Chrome: Cmd/Ctrl + Shift + R

# 4. Verify SSL certificate is trusted

# 5. Check Vite config for HMR settings
cat vite.config.js
```

### Inertia Page Not Found

**Symptom**: `Inertia page component not found`

**Solutions**:

```bash
# 1. Check page file exists
ls -la resources/js/pages/Dashboard.vue
ls -la modules/Auth/resources/js/pages/Login.vue

# 2. Rebuild assets
npm run build

# 3. Clear Laravel caches
php artisan optimize:clear

# 4. Verify namespace syntax for module pages
# Use: Inertia::render('Auth::Login')
# Not: Inertia::render('modules/Auth/Login')

# 5. Check for typos in page name
# Names are case-sensitive!
```

### TypeScript Errors

**Symptom**: Type errors in IDE or build failures

**Solutions**:

```bash
# Generate fresh types
php artisan ziggy:generate

# Restart TypeScript server (VS Code)
# Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"

# Check tsconfig.json paths
cat tsconfig.json

# Install missing type definitions
npm install --save-dev @types/node
```

## Build & Deployment Issues

### Production Build Fails

**Symptom**: `npm run build` shows errors

**Solutions**:

```bash
# Clear all caches
rm -rf node_modules/.vite
rm -rf public/build
npm run build

# Check for TypeScript errors
npx tsc --noEmit

# Run linter
npm run lint

# Check for missing dependencies
npm install
```

### SSR Build Fails

**Symptom**: `npm run build:ssr` fails

**Solutions**:

```bash
# 1. Clear SSR cache
rm -rf bootstrap/ssr

# 2. Rebuild with verbose output
npm run build -- --debug

# 3. Check for SSR-incompatible code
# Look for: window, document, localStorage access
# These need to be wrapped in: if (typeof window !== 'undefined')

# 4. Restart Inertia SSR server
php artisan inertia:stop-ssr
php artisan inertia:start-ssr
```

### Assets Not Loading in Production

**Symptom**: CSS/JS files return 404 in production

**Solutions**:

```bash
# 1. Build assets for production
npm run build

# 2. Check public/build directory exists
ls -la public/build

# 3. Verify APP_ENV in .env
# Should be: APP_ENV=production

# 4. Check ASSET_URL in .env (if using CDN)

# 5. Clear application cache
php artisan optimize
```

## Database Issues

### Migrations Fail

**Symptom**: `php artisan migrate` shows errors

**Solutions**:

```bash
# Check database connection
php artisan db:show

# View migration status
php artisan migrate:status

# Roll back last migration
php artisan migrate:rollback

# Fresh migrate (CAUTION: destroys data)
php artisan migrate:fresh

# Seed database
php artisan db:seed

# Check for SQL syntax errors in migration files
```

### Database Connection Timeout

**Symptom**: `SQLSTATE[HY000] [2002] Operation timed out`

**Solutions**:

```bash
# 1. Check database is running
docker compose ps mysql

# 2. Verify DB credentials in .env
DB_HOST=mysql       # Use container name when in Docker
DB_PORT=3306
DB_DATABASE=saucebase
DB_USERNAME=root
DB_PASSWORD=secret

# 3. Test database connection
docker compose exec app php artisan tinker
>>> DB::connection()->getPdo();

# 4. Restart database container
docker compose restart mysql
```

## Performance Issues

### Slow Page Loads

**Symptom**: Pages take several seconds to load

**Solutions**:

```bash
# 1. Enable query logging to find slow queries
# Add to AppServiceProvider boot():
DB::enableQueryLog();

# 2. Check for N+1 query problems
# Use: php artisan debugbar:publish (Laravel Debugbar)

# 3. Cache configuration
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 4. Enable OPcache in production
# Check: php -i | grep opcache

# 5. Use Redis for cache/sessions
# Already configured in .env
```

### Memory Limit Exceeded

**Symptom**: `PHP Fatal error: Allowed memory size exhausted`

**Solutions**:

```bash
# Temporarily increase memory limit
php -d memory_limit=512M artisan command

# Permanently increase in php.ini
# memory_limit = 256M

# Or set in .env (Laravel specific commands)
# Add to bootstrap/app.php:
ini_set('memory_limit', '256M');

# Optimize composer autoloader
composer dump-autoload --optimize
```

## Testing Issues

### PHPUnit Tests Fail

**Symptom**: `php artisan test` shows failures

**Solutions**:

```bash
# Run with verbose output
php artisan test --testsuite=Feature --verbose

# Clear test cache
php artisan test:clear

# Check test database configuration
cat phpunit.xml
# Should use: DB_DATABASE=:memory: (SQLite)

# Run specific test
php artisan test --filter testUserCanLogin

# Check for environment-specific issues
cat .env.testing
```

### Playwright Tests Fail

**Symptom**: `npm run test:e2e` shows errors

**Solutions**:

```bash
# Install/update browsers
npx playwright install

# Run in headed mode to see what's happening
npm run test:e2e:headed

# Run in debug mode
npm run test:e2e:debug

# Check Playwright config
cat playwright.config.ts

# View test report
npm run test:e2e:report

# Clear test artifacts
rm -rf test-results playwright-report
```

## Cache Issues

### Stale Configuration

**Symptom**: Configuration changes not taking effect

**Solutions**:

```bash
# Clear all caches
php artisan optimize:clear

# Or clear specific caches
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear

# In production, re-cache after clearing
php artisan optimize
```

### Redis Connection Issues

**Symptom**: `Connection refused [tcp://127.0.0.1:6379]`

**Solutions**:

```bash
# Check Redis is running
docker compose ps redis

# Test Redis connection
docker compose exec redis redis-cli ping
# Should return: PONG

# Verify Redis settings in .env
REDIS_HOST=redis    # Use container name
REDIS_PORT=6379

# Restart Redis
docker compose restart redis

# Flush Redis cache
docker compose exec redis redis-cli FLUSHALL
```

## Authentication Issues

### Login Redirect Loop

**Symptom**: Redirects to login page repeatedly

**Solutions**:

```bash
# 1. Check session driver in .env
SESSION_DRIVER=redis

# 2. Clear sessions
php artisan session:flush

# 3. Check authentication middleware
# Verify routes have correct middleware

# 4. Clear browser cookies

# 5. Check APP_URL matches actual URL
# APP_URL=https://localhost
```

### Social Login Not Working

**Symptom**: OAuth providers return errors

**Solutions**:

```bash
# 1. Verify OAuth credentials in .env
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret

# 2. Check redirect URLs in OAuth provider
# Must match: https://localhost/auth/google/callback

# 3. Enable OAuth providers in config
cat config/services.php

# 4. Clear config cache
php artisan config:clear

# 5. Check SSL certificate is valid
```

## Common Error Messages

### "Class not found"

```bash
# Regenerate autoload
composer dump-autoload

# Clear bootstrap cache
rm -rf bootstrap/cache/*.php

# Verify namespace in file matches directory structure
```

### "Route not defined"

```bash
# Clear route cache
php artisan route:clear

# List all routes
php artisan route:list

# Check route name is correct (case-sensitive)

# Verify route is defined in web.php or module routes
```

### "View not found"

```bash
# Clear view cache
php artisan view:clear

# Verify view file exists
ls -la resources/views/app.blade.php

# Check view name spelling
```

### "CSRF token mismatch"

```bash
# Clear sessions
php artisan session:flush

# Check @csrf directive in forms

# Verify session driver is working
cat storage/logs/laravel.log

# Clear browser cookies
```

## Getting Help

If you're still stuck after trying these solutions:

1. **Check logs**:
   ```bash
   # Laravel logs
   tail -f storage/logs/laravel.log

   # Docker logs
   docker compose logs -f app

   # Nginx logs
   docker compose logs -f nginx

   # Real-time logs with Pail
   php artisan pail --timeout=0
   ```

2. **Search documentation**: Use the search bar (press `/` key)

3. **Check GitHub issues**: [github.com/saucebase-dev/saucebase/issues](https://github.com/saucebase-dev/saucebase)

4. **Stack Overflow**: Tag questions with `laravel`, `inertiajs`, `vue3`

5. **Laravel Discord**: [discord.gg/laravel](https://discord.gg/laravel)

## Preventive Measures

Avoid common issues by following these practices:

### Daily Development

```bash
# Start each day with fresh state
git pull origin main
composer install
npm install
php artisan optimize:clear
npm run dev
```

### Before Committing

```bash
# Run quality checks
composer analyse
composer lint
npm run lint
php artisan test
```

### Production Deployment

```bash
# Optimize for production
composer install --no-dev --optimize-autoloader
npm run build
php artisan optimize
php artisan migrate --force
```

## Next Steps

- [Configuration](/getting-started/configuration) - Environment setup and configuration
- [Commands](/development/commands) - All available development commands
- [Glossary](/reference/glossary) - Technical terms and definitions
