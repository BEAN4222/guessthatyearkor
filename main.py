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




def get_random_video():
    # JSON 파일의 키를 지정합니다.
    key = "videos.json"

    # JSON 파일을 다운로드합니다.
    result = s3.get_object(Bucket='imgstgforguesstheyear', Key=key)
    videos = json.load(result["Body"])

    if not videos:
        raise Exception("No videos found in JSON file")
    random_index = random.randint(0, len(videos) - 1)

    # 선택한 인덱스의 동영상 정보를 반환합니다.
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