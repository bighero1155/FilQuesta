FROM php:8.2-cli

# Install system deps
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    default-mysql-client \
    libpq-dev \
    && docker-php-ext-install pdo_mysql pdo_pgsql zip

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Copy Laravel
COPY . .

# Install PHP deps
RUN composer install --no-dev --optimize-autoloader

# Prepare Laravel
RUN php artisan storage:link || true
RUN chmod -R 775 storage bootstrap/cache || true

EXPOSE 10000

CMD php artisan migrate --force && php -S 0.0.0.0:10000 -t public