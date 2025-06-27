#!/bin/sh
set -e

python manage_production.py migrate
python manage_production.py collectstatic --noinput
exec gunicorn bonded_backend.wsgi:application --bind 0.0.0.0:8000
