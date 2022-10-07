FROM python:latest

WORKDIR /scripts/armies/

COPY . /scripts/armies/

#RUN apk --no-cache add musl-dev linux-headers g++

RUN pip install -r requirements.txt

CMD ["./setup_armies_database.py"]
