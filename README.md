
# prisma

```bash
git clone https://github.com/ticontrolrn/prisma
cd prisma
```

`.env` na raiz do projeto:

```env
POSTGRES_DB=
POSTGRES_USER=
POSTGRES_PASSWORD=

DJANGO_SECRET_KEY=
DJANGO_DEBUG=
DJANGO_ALLOWED_HOSTS=
```

Na raiz do projeto:

```bash
docker compose build
docker compose up
```

Na pasta `react`:

```bash
cd react
npm install
cd ..
```

# Django
```
http://localhost:8000/admin/
```

- Rodar migrações manualmente, se necessário:
  ```
  docker compose exec drf python manage.py makemigrations
  ```
  ```
  docker compose exec drf python manage.py migrate
  ```
- Criar um superusuário:
  ```
  docker compose run --rm drf python manage.py createsuperuser 
  ```

# React
```
http://localhost:5173
```
