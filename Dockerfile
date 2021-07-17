FROM php:7.4-apache
# RUN docker-php-ext-install mysqli
RUN docker-php-ext-install pdo pdo_mysql  && \
    apt-get update && apt-get install -y \
    libmagickwand-dev --no-install-recommends \
    && pecl install imagick \
	&& docker-php-ext-enable imagick
