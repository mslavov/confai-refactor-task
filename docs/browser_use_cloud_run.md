# Deploying **browser-use** with FastAPI on Google Cloud Run

## 1. Scaffold a FastAPI wrapper

### `main.py`

```python
import os, asyncio
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from langchain_openai import ChatOpenAI
from browser_use import Agent

# One agent per container instance (Cloud Run autoscales the instances for us)
MODEL = ChatOpenAI(model="gpt-4o-mini", temperature=0)
AGENT = Agent(MODEL)

app = FastAPI(title="browser-use API")

class Task(BaseModel):
    goal: str
    timeout: int | None = 60  # seconds

@app.post("/run")
async def run(task: Task):
    try:
        result = await asyncio.wait_for(AGENT.run(task.goal), timeout=task.timeout)
        return {"result": result}
    except asyncio.TimeoutError:
        raise HTTPException(504, "agent timed out")
    except Exception as exc:
        raise HTTPException(500, str(exc))
```

### `requirements.txt`

```
browser-use
fastapi
uvicorn[standard]
langchain-openai
python-dotenv
```

---

## 2. Containerise

### `Dockerfile`

```dockerfile
# syntax=docker/dockerfile:1.6
FROM python:3.11-slim AS base

# ---- OS packages Chromium needs ----
RUN apt-get update &&     apt-get install -y --no-install-recommends         curl unzip libnss3 libatk1.0-0 libatk-bridge2.0-0 libx11-xcb1         libgtk-3-0 libxcomposite1 libxdamage1 libxrandr2 libgbm1         libpango-1.0-0 libcairo2 libxext6 libxfixes3 libxi6 libxtst6         fonts-liberation &&     rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Pre‑download Chromium so cold‑starts are fast
RUN patchright install chromium --with-deps --no-shell

COPY . .
ENV PYTHONUNBUFFERED=1 PORT=8080
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
```

---

## 3. Smoke‑test locally

```bash
docker build -t browser-use-api .
docker run -p 8080:8080   -e OPENAI_API_KEY=sk-***   browser-use-api

curl -X POST localhost:8080/run   -H "Content-Type: application/json"   -d '{"goal":"open example.com and screenshot"}'
```

**Cloud Run** expects the container to listen on **0.0.0.0:8080**.

---

## 4. Bootstrap your Google Cloud project (one‑off)

```bash
gcloud init
gcloud config set project $PROJECT_ID

# Enable the services Cloud Run needs
gcloud services enable run.googleapis.com artifactregistry.googleapis.com   cloudbuild.googleapis.com secretmanager.googleapis.com

# OPTIONAL: create an Artifact Registry repo
gcloud artifacts repositories create browser-use-api   --repository-format=docker --location=us-central1
```

Add your OpenAI key to Secret Manager:

```bash
printf "%s" "$OPENAI_API_KEY" |   gcloud secrets create OPENAI_API_KEY --data-file=-
```

---

## 5. Build & deploy

```bash
# Cloud Build will build the image and push to Artifact Registry
gcloud builds submit --tag   us-central1-docker.pkg.dev/$PROJECT_ID/browser-use-api/browser-use-api:latest

# Ship to Cloud Run
gcloud run deploy browser-use-api   --image us-central1-docker.pkg.dev/$PROJECT_ID/browser-use-api/browser-use-api:latest   --region us-central1   --platform managed   --port 8080   --memory 1Gi --cpu 1 --max-instances 5   --allow-unauthenticated   --set-secrets "OPENAI_API_KEY=OPENAI_API_KEY:latest"
```

Cloud Run will output a **public HTTPS URL** for your new service.
