# Sử dụng image WordPress chính thức (PHP 8.3 + Apache)
                FROM wordpress:6.6.1-php8.3-apache

                # Cài các thư viện cần thiết và extension Memcached để kết nối Redis
                RUN apt-get update && apt-get install -y --no-install-recommends \
                libmemcached-dev zlib1g-dev libssl-dev \
                && pecl install memcached \
                && docker-php-ext-enable memcached \
                && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/pear/*

                # Cấp quyền sở hữu cho Apache
                RUN chown -R www-data:www-data /var/www/html
                EXPOSE 80
