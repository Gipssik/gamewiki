FROM python:3.10.3



RUN pip install poetry==1.1.14
RUN apt-get update &&  \
    apt-get install --no-install-recommends --assume-yes postgresql-client

# Configuring poetry
RUN poetry config virtualenvs.create false

# Copying requirements of a project
COPY pyproject.toml poetry.lock /app/src/
WORKDIR /app/src

# Installing requirements
RUN poetry install

# Copying actuall application
COPY . /app/src/
RUN poetry install

CMD ["/usr/local/bin/python", "-m", "backend", "runserver"]
