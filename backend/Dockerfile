FROM python:3.13-slim

LABEL org.opencontainers.image.title="Marquillas Task Manager" \
      org.opencontainers.image.vendor="Nexo Software Factory" \
      org.opencontainers.image.authors="Daniel Arboleda" \
      org.opencontainers.image.description="Technical Assessment Backend" \
      org.opencontainers.image.version="0.1.0"

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir --upgrade pip

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn","app.main:app","--host","0.0.0.0","--port","8000"]