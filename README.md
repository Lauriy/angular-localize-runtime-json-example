Running the backend

```shell
source backend/venv/bin/activate
pip install -r backend/requirements.txt
python backend/manage.py runserver
```

Running the frontend

```shell
cd frontend
nvm use lts/iron
npm i
ng serve
```