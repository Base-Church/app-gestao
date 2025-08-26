FROM php:8.4-apache

# Instalar extensões PHP necessárias
RUN apt-get update && apt-get install -y \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libpng-dev \
    libzip-dev \
    unzip \
    git

# Instalar extensões PHP
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd zip pdo pdo_mysql

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copiar arquivos do projeto
COPY . /var/www/html/

# Instalar dependências ignorando requisitos de plataforma
RUN composer install --no-scripts --no-interaction --ignore-platform-reqs

# Configurar permissões
RUN chown -R www-data:www-data /var/www/html

EXPOSE 80