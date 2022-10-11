FROM python:latest

WORKDIR /scripts/armies/

COPY . /scripts/armies/

RUN pip install -r requirements.txt

CMD ["./src/setup_armies_database.py"]
