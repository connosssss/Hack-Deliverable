from contextlib import asynccontextmanager
from datetime import datetime
from typing import AsyncIterator

from fastapi import FastAPI, Form, status
from fastapi.responses import RedirectResponse
from typing_extensions import TypedDict

from services.database import JSONDatabase


class Quote(TypedDict):
    name: str
    message: str
    time: str


database: JSONDatabase[list[Quote]] = JSONDatabase("data/database.json")


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """Handle database management when running app."""
    if "quotes" not in database:
        print("Adding quotes entry to database")
        database["quotes"] = []

    yield

    database.close()


app = FastAPI(lifespan=lifespan)


@app.post("/quote")
def post_message(name: str = Form(), message: str = Form()) -> RedirectResponse:
    """
    Process a user submitting a new quote.
    You should not modify this function except for the return value.
    """
    now = datetime.now()
    quote = Quote(name=name, message=message, time=now.isoformat(timespec="seconds"))
    database["quotes"].append(quote)

    # You may modify the return value as needed to support other functionality
    return RedirectResponse("/", status.HTTP_303_SEE_OTHER)


# TODO: add another API route with a query parameter to retrieve quotes based on max age


# starting off by just fetching all quotes and getting basic things working (sorry if this is going to be too small of steps)
@app.get("/quote")
async def get_quotes(max_age: str = None) -> list[Quote]:
    quotes = database["quotes"]

    if not max_age:
        return quotes


    try:
        max_age_date = datetime.fromisoformat(max_age)

        filtered = []

        for quote in quotes:
            print(datetime.fromisoformat(quote["time"]))
            if datetime.fromisoformat(quote["time"]) >= max_age_date:
                filtered.append(quote)

        return filtered

    except Exception as error:
        print(f"Error filtering quotes, returning all of them \n Error Message: {error}")
        return quotes
        