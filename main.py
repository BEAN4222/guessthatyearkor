import boto3
import json
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


key = "videos.json"
videos = None
def get_random_video():
    global videos
    if videos is None:
        try:
            result = s3.get_object(Bucket='imgstgforguesstheyear', Key=key)
            videos = json.load(result["Body"])
        except Exception as e:
            raise Exception("An error occurred while downloading the JSON file: " + str(e))

    if not videos:
        raise Exception("No videos found in JSON file")

    # 선택한 인덱스의 동영상 정보를 반환합니다.
    random_index = random.randint(0, len(videos) - 1)
    return videos[random_index]



@app.get("/img")
async def image():
    return get_random_video()

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