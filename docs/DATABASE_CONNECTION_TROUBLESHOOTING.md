# Database Connection Troubleshooting Guide

## Error: `connect ENETUNREACH` or Database Connection Issues

If you're seeing errors like:
```
connect ENETUNREACH 2406:da1a:6b0:f618:cc5:feb5:e139:8cf9:5432
```

This indicates the application cannot reach your PostgreSQL database.

## Common Causes & Solutions

### 1. **Incorrect Database Host Configuration**

**Problem:** The `DB_HOST` environment variable might be set to an IPv6 address or incorrect hostname.

**Solution:**
- Use the IPv4 address or hostname provided by your database provider
- For Render PostgreSQL: Use the **Internal Database URL** hostname (not IPv6)
- For external databases: Ensure you're using the correct hostname/IP

**Check your environment variables in Render:**
```
DB_HOST=your-database-host (should be a hostname or IPv4, not IPv6)
DB_PORT=5432
DB_USER=your-username
DB_PASSWORD=your-password
DB_DATABASE=your-database-name
```

### 2. **Using Render PostgreSQL Database**

If you're using Render's PostgreSQL service:

1. **Get the Internal Database URL:**
   - Go to your PostgreSQL service in Render dashboard
   - Copy the **Internal Database URL** (not the External URL)
   - Format: `postgres://user:password@hostname:5432/database`

2. **Parse and set environment variables:**
   ```
   DB_HOST=<hostname-from-internal-url>
   DB_PORT=5432
   DB_USER=<user-from-internal-url>
   DB_PASSWORD=<password-from-internal-url>
   DB_DATABASE=<database-name-from-internal-url>
   ```

3. **Important:** Use the **Internal Database URL** when both services are on Render. The External URL is for connections outside Render's network.

### 3. **Database Not Accessible from Render**

**Problem:** Your database might be:
- Behind a firewall
- Only accessible from specific IPs
- On a different network/VPC

**Solution:**
- For Render PostgreSQL: Ensure both services are in the same region
- For external databases: Whitelist Render's IP addresses or use a VPN
- Check database security groups/firewall rules

### 4. **IPv6 vs IPv4 Issue**

**Problem:** The error shows an IPv6 address, but your database might only accept IPv4.

**Solution:**
- Use the IPv4 address or hostname instead of IPv6
- Ensure `DB_HOST` is set to a hostname (DNS will resolve to the correct IP)
- Avoid using raw IPv6 addresses in `DB_HOST`

### 5. **Database Service Not Running**

**Problem:** The database service might be stopped or paused.

**Solution:**
- Check your database service status in Render dashboard
- Ensure the database is running and not paused
- Restart the database service if needed

### 6. **Incorrect Credentials**

**Problem:** Database username, password, or database name might be incorrect.

**Solution:**
- Double-check all database credentials
- Ensure there are no extra spaces or special characters
- Test connection with a database client (pgAdmin, DBeaver, etc.)

## Quick Fix Steps

1. **Verify Environment Variables in Render:**
   - Go to your Web Service → Environment
   - Check all `DB_*` variables are set correctly
   - Ensure no typos or extra spaces

2. **Use Internal Database URL (Render):**
   - If using Render PostgreSQL, use the Internal URL
   - Parse it into separate environment variables

3. **Test Database Connection:**
   - Use the `/health` endpoint to check if the app starts
   - Check application logs for detailed error messages

4. **Check Database Service:**
   - Ensure PostgreSQL service is running
   - Check service logs for any errors

## Example: Setting Up Render PostgreSQL

1. **Create PostgreSQL service in Render**
2. **Get Internal Database URL:**
   ```
   postgres://user:password@dpg-xxxxx-a.oregon-postgres.render.com:5432/dbname
   ```

3. **Set environment variables in your Web Service:**
   ```
   DB_HOST=dpg-xxxxx-a.oregon-postgres.render.com
   DB_PORT=5432
   DB_USER=user
   DB_PASSWORD=password
   DB_DATABASE=dbname
   ```

4. **Redeploy your service**

## Testing Database Connection

After setting up, test the connection:

1. **Check health endpoint:** `GET /health`
2. **Try a simple API call** that requires database access
3. **Check application logs** for connection errors

## Still Having Issues?

1. Check Render service logs for detailed error messages
2. Verify database service is in the same region as your web service
3. Ensure database service is not paused
4. Try connecting with a database client to verify credentials
5. Check if there are any network restrictions or firewall rules

