import boto3
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import StreamingResponse,HTMLResponse
from starlette.config import Config
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
import random

config = Config(".env")

app = FastAPI()
templates = Jinja2Templates(directory="templates")
app.mount("/static", StaticFiles(directory="static"),name="static")

s3 = boto3.client(
    "s3",
    aws_access_key_id=config('s3_id'),
    aws_secret_access_key=config('s3_secret_key')
)


def get_random_image():
    response = s3.list_objects_v2(Bucket="imgstgforguesstheyear")
    objects = response.get("Contents", [])
    if not objects:
        raise Exception("No images found in bucket")
    random_key = random.choice(objects)["Key"]
    result = s3.get_object(Bucket="imgstgforguesstheyear", Key=random_key)
    metadata = result['Metadata']
    headers = {}
    for key, value in metadata.items():
        headers[f'x-amz-meta-{key}'] = value
    return StreamingResponse(content=result["Body"].iter_chunks(), headers=headers)


@app.get("/img")
async def image():
    return get_random_image()

@app.get("/")
async def main(request: Request):
    try:
        return templates.TemplateResponse("game.html",{"request": request})
    except Exception as e:
        if hasattr(e, "message"):
            raise HTTPException(
                status_code=e.message["response"]["Error"]["Code"],
                detail=e.message["response"]["Error"]["Message"],
            )
        else:
            raise HTTPException(status_code=500, detail=str(e))