#!/bin/bash

# Make storage directory writable
mkdir -p /app/storage
chmod -R 777 /app/storage

# Install composer dependencies
composer install --no-dev --optimize-autoloader

# Start FrankenPHP
/usr/local/bin/frankenphp run --config /app/Caddyfile
