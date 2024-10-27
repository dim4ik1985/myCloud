# myCloud

[![Build Status](https://github.com/dim4ik1985/myCloud/actions/workflows/build.yml/badge.svg)](https://github.com/dim4ik1985/myCloud/actions/workflows/build.yml)

[![NPM version](https://img.shields.io/npm/v/mycloud.svg)](https://github.com/dim4ik1985/myCloud)

## Getting Started

### Description

[myCloud](https://github.com/dim4ik1985/myCloud) is a web application that allows you to store and share files with other users. The application is built using the Vite JavaScript framework.

## Frontend

### Installation

`cd frontend`

`npm install mycloud`

### Usage

`npm run dev`

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


### Installation

Create virtual environment

`python3 -m venv .venv`

Activate virtual environment

`source .venv/bin/activate`

Install dependencies

`pip install -r requirements.txt`

`touch .env`

`nano .env`

```
    DJANGO_SECRET_KEY='some secret key'
    DEBUG='False'
    ALLOWED_HOSTS=''
    DJANGO_ALLOWED_HOSTS=''
    DB_NAME='name_of_database'
    DB_USER='username'
    DB_PASSWORD='password'
    DB_HOST='host'
    DB_PORT='port'
```




