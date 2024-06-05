import {ApiResponse} from "../api";

type City={
    city:string,
    station_code:string,
    station_short:string
}


export type GetCityResponseData = Array<City>
export type GetCityResponse = ApiResponse<GetCityResponseData>;

