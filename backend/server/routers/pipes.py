import os

from typing import Annotated
from fastapi import APIRouter, UploadFile, File
from server.models.pipes import Pipes
from server.models.microservices import MicroserviceContent
from server.database import pipes_collection
from server.schemas.schemas import list_pipes_serial
from parsing_modules.microservice_extractor import extract_microservice
import json

# Used for fetching Mongo objectID
from bson import ObjectId

router = APIRouter()

# pipes_list GET


@router.get("/pipes/list")
async def get_pipes():
    pipes = list_pipes_serial(pipes_collection.find())
    return pipes


@router.post("/pipes/create")
async def create_pipe(pipe: Pipes):
    pipes_collection.insert_one(dict(pipe))
    condensed_microservices = []
    for microservice in pipe.microservices:
        # for idx, param in enumerate(microservice["parameters"]):
        #     microservice["parameters"][idx] = param.split("=")[-1]
        condensed_microservices.append(
            {
                "file": microservice["parent_file"],
                "name": microservice["name"],
                "parameters": microservice["parameters"]
            }
        )
    return_dict = {
        "pipeline": pipe.name,
        "microservices": condensed_microservices
    }

    json_object = json.dumps(return_dict, indent=4)
    with open("pipeline.json", "w") as outfile:
        outfile.write(json_object)


@router.put("/pipes/{id}")
async def edit_pipe(id: str, pipe: Pipes):
    pipes_collection.find_one_and_update(
        {"_id": ObjectId(id)}, {"$set": dict(pipe)})


@router.delete("/pipes/{id}")
async def delete_pipe(id: str):
    pipes_collection.find_one_and_delete(
        {"_id": ObjectId(id)})

# @router.get('/get_stock_data/{stock_name}')
# async def get_stock_data(stock_name:str):
#     # Fetch data for the selected stock here
#     try:
#         stock_data = yf.Ticker(stock_name)
#         stock_data = stock_data.history()
#     except:
#         print("Stock name is wrong")
#         return
#     # Process and return the data
#     if not isinstance(stock_data, pd.DataFrame):
#         stock_data = pd.DataFrame(stock_data)
#     stock_data['stock_name'] = stock_name
#     stock_data = stock_data.to_dict(orient='records')
#     stock_collection.insert_many(stock_data)
#@router.get('/get_stock_data/{stock_name}')
#async def get_stock_data(stock_name: str):
#    for stock in stock_collection.find({"stock_name": stock_name}):

@router.delete("/clear/pipes")
async def clear_all():
    pipes_collection.drop()
