# myCloud

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


### DJANGO SETUP

1. Устанавливаем пакеты  
   `sudo apt install python3-venv python3-pip postgresql nginx`
2. Проверка работоспособности postgresql  
   `sudo systemctl status postgresql`
3. Проверка работоспособности nginx  
   `sudo systemctl status nginx`
4. Клонируем репозиторий   
   `git clone github.com/dim4ik1985/myCloud.git`
5. Переходим в папку  
   `cd myCloud/backend/`
6. Создаем виртуальное окружение  
   `python3 -m venv .venv`
7. Активируем виртуальное окружение  
   `source .venv/bin/activate`
8. Устанавливаем зависимости  
   `pip install -r requirements.txt`


### REACT SETUP

1. Install nvm
   `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash`
2. Копируем `export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm` и вставляем в терминал
3. Устанавливаем пакеты  
   `nvm install 22`
4. Переходи в папку frontend  
   `cd frontend`
   Создаем файл .env
5. Заполняем .env
    `VITE_BASE_URL=http://ip_address_server`
6. Устанавливаем зависимости  
   `npm install`
7. Запускаем команду для сборки проекта  
   `npm run build`



### Настройка базы данных

1. Создаем пользователя  
    ```postresql
   sudo -u postgres psql
   CREATE ROLE username WITH LOGIN PASSWORD 'password' CREATEDB;
   CREATE DATABASE db_name OWNER username;
   GRANT ALL PRIVILEGES ON DATABASE db_name TO username;
   \q
    ```

 ### Настройка переменных окружения

1. Создаем файл .env
2. Заполняем .env  
     ```dotenv
    DJANGO_SECRET_KEY='some secret key'
    DEBUG='False'
    ALLOWED_HOSTS='127.0.0.1,localhost,your_server_ip'
    DB_NAME='name_of_database'
    DB_USER='username'
    DB_PASSWORD='password'
    DB_HOST='localhost'
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
      root /home/dmi85/myCloud/frontend/dist;
      index index.html index.htm;

      location / {
        try_files $uri $uri/ /index.html;
      }

      location /static/ {
        root /home/user_name/project_name;
      }
   
      location /api/ {
        include proxy_params;
        proxy_pass http://unix:/home/user_name/project_name/path/to/project.sock;
      }
    
      location /admin/ {
        include proxy_params;
        proxy_pass http://unix:/home/dmi85/myCloud/backend/cloud/gunicorn.sock;
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
7. Включаем логирование
    `sudo tail -f /home/dmi85/myCloud/backend/information.log`

    

    





