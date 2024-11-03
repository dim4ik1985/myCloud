# myCloud

[![Build Status](https://github.com/dim4ik1985/myCloud/actions/workflows/build.yml/badge.svg)](https://github.com/dim4ik1985/myCloud/actions/workflows/build.yml)

[![NPM version](https://img.shields.io/npm/v/mycloud.svg)](https://github.com/dim4ik1985/myCloud)

## Getting Started

### Description

[myCloud](https://github.com/dim4ik1985/myCloud) — это веб-приложение, которое позволяет хранить файлы и обмениваться ими с другими пользователями. Приложение создано с использованием фреймворка Vite JavaScript.

## Frontend


### Dependencies

- [Vite](https://vitejs.dev/)
- [React](https://reactjs.org/)
- [React Router](https://reactrouter.com/)
- [Redux](https://redux.js.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Hook Form](https://react-hook-form.com/)

## Backend

### Dependencies

- [Django](https://www.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [django-cors-headers](https://pypi.org/project/django-cors-headers/)
- [psycopg2](https://www.psycopg.org/)
- [djangorestframework-simplejwt](https://django-rest-framework-simplejwt.readthedocs.io/en/latest/)


## Развертывание проекта на виртуальном сервере


### Подключение к виртуальному серверу

1. Создать пару ключей SSH папку ~/.ssh для подтверждения подлинности сервера
    `ssh-keygen`  
    
2. Копировать ключ SSH   
    `cat ~/.ssh/id_rsa.pub`

3. Добавить SSH ключ в настройки конфигурации виртуального сервера
4. С помощью терминала подключаемся к серверу  
    `ssh root@server_ip`
5. Создаем нового пользователя  
    `adduser user_name`
6. Добавляем пользователя в группу superuser  
    `usermod user_name -aG sudo`
7. Перезагружаем сервер
8. Подключаемся к серверу  
    `ssh user_name@server_ip`
9. Устанавливаем пакеты  
    `sudo apt update && sudo apt upgrade`
10. Устанавливаем пакеты  
    `sudo apt install python3-venv python3-pip postgresql nginx`
11. Проверка работоспособности postgresql  
    `sudo systemctl status postgresql`
12. Проверка работоспособности nginx  
    `sudo systemctl status nginx`
13. Клонируем репозиторий   
    `git clone https://github.com/dim4ik1985/myCloud/tree/dev`
14. Создаем виртуальное окружение  
    `python3 -m venv .venv`
15. Активируем виртуальное окружение  
    `source .venv/bin/activate`
16. Устанавливаем зависимости  
    `pip install -r requirements.txt`

### Настройка базы данных

1. Создаем пользователя  
    ```postresql
   sudo su postgres
   psql
   CREATE USER user_name WITH SUPERUSER;
   ALTER USER user_name WITH PASSWORD 'password';
   CREATE DATABASE user_name;
   \q
   exit
    ```

2. Подключаемся к базе данных
   ```postresql
   psql
   CREATE DATABASE db_name;
   \q
   ```

 ### Настройка переменных окружения

1. Создаем файл .env
2. Заполняем .env  
     ```dotenv
    DJANGO_SECRET_KEY='some secret key'
    DEBUG='False'
    DJANGO_ALLOWED_HOSTS=''
    DB_NAME='name_of_database'
    DB_USER='username'
    DB_PASSWORD='password'
    DB_HOST='host'
    DB_PORT='port'
     ```
3. Применяем миграции  
    `python3 manage.py migrate`  


### Настройка gunicorn

1. Запускаем сервер  
    `gunicorn cloud.wsgi -b 0.0.0.0:8000`
2. Настройка конфигурации gunicorn
    `sudo nano /etc/systemd/system/gunicorn.service`
    ```gunicorn.service
    [Unit]
    Description=gunicorn service
    After=network.target
   
    [Service]
    User=root
    Group=www-data
    WorkingDirectory=/home/user_name/project_name
    ExecStart=/home/user_name/.venv/bin/gunicorn --access-logfile -\
    --workers=3 \
    --bind unix:/home/user_name/project_name/path/to/gunicorn.sock package_name.wsgi:application
   
    [Install]
    WantedBy=multi-user.target
    ```
3. Запускаем gunicorn  
    `sudo systemctl start gunicorn`
    `sudo systemctl enable gunicorn`
4. Проверяем работоспособность gunicorn
    `sudo systemctl status gunicorn`

### Настройка nginx

1. Настройка статики
    ```settings.py
    MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
    MEDIA_URL = '/media/'
    STATIC_ROOT = os.path.join(BASE_DIR, 'static')
    STATIC_URL = '/static/'
   ```
2. Собираем статические файлы
    `python3 manage.py collectstatic`
3. Настройка конфигурации nginx
    `sudo nano /etc/nginx/sites-available/project_name`
    ```cloud
    server {
        listen 80;
        server_name server_ip;
        location /static/ {
            root /home/user_name/project_name;
        }
        location / {
            include proxy_params;
            proxy_pass http://unix:/home/user_name/project_name/path/to/project.sock;
        }
    }
    ```
4. Активируем nginx
    `sudo ln -s /etc/nginx/sites-available/project_name /etc/nginx/sites-enabled`
5. Перезагружаем nginx
    `sudo systemctl stop nginx`
    `sudo systemctl start nginx`
    `sudo systemctl status nginx`
6. Разрешаем доступ к nginx 
    `sudo ufw allow 'Nginx Full'`
   
    

    





