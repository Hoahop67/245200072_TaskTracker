FROM php:8.3-apache

RUN docker-php-ext-install pdo pdo_mysql mysqli

COPY src/ /var/www/html/

RUN chown -R www-data:www-data /var/www/html  && chmod -R 755 /var/www/html

RUN a2enmod rewrite

EXPOSE 80

CMD ["apache2-foreground"]
