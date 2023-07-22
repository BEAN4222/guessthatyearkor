import boto3
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from starlette.config import Config

config = Config(".env")

app = FastAPI()
s3 = boto3.client(
    "s3",
    aws_access_key_id=config('s3_id'),
    aws_secret_access_key=config('s3_secret_key')
)


print(config('s3_id'))
@app.get("/")
async def main():
    try:
        result = s3.get_object(Bucket="imgstgforguesstheyear", Key="KakaoTalk_20230718_164159968.jpg")
        return StreamingResponse(content=result["Body"].iter_chunks())
    except Exception as e:
        if hasattr(e, "message"):
            raise HTTPException(
                status_code=e.message["response"]["Error"]["Code"],
                detail=e.message["response"]["Error"]["Message"],
            )
        else:
            raise HTTPException(status_code=500, detail=str(e))