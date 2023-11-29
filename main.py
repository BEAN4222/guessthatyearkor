import boto3
import json
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import StreamingResponse,HTMLResponse
from starlette.config import Config
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
import random
from datetime import datetime

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
videos_after_selected_date = None
standarddate = 0
def get_random_video(selected_date):
    global videos
    global videos_after_selected_date,standarddate
    if videos is None:
        try:

            result = s3.get_object(Bucket='imgstgforguesstheyear', Key=key)
            videos = json.load(result["Body"])
            

        except Exception as e:
            raise Exception("An error occurred while downloading the JSON file: " + str(e))
    if videos_after_selected_date is None or standarddate!=selected_date:
        standarddate = selected_date
        videos_after_selected_date = [video for video in videos if datetime.strptime(video['date'], '%Y-%m-%d') >= selected_date]
    if not videos:
        raise Exception("No videos found in JSON file")
    if not videos_after_selected_date:
        raise Exception("No videos found in JSON file")
    print(selected_date,len(videos_after_selected_date))
    # 선택한 인덱스의 동영상 정보를 반환합니다.
    random_index = random.randint(0, len(videos_after_selected_date) - 1)
    return videos_after_selected_date[random_index]



@app.get("/img")
async def image(request: Request):
    try:
        selected_date_str = request.query_params.get('date')
        selected_date = datetime.strptime(selected_date_str, '%Y-%m-%d')
        print(selected_date)
        return get_random_video(selected_date)
    except Exception as e:
        print('Exception occurred:', str(e))
        raise HTTPException(status_code=500,detail=str(e))
    
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