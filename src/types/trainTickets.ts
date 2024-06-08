export const DEFAULT_TRAIN_TICKETS_DATA:TrainDataArray=[{
    'start':'',
    'dest':'',
    'date':'',
    'tickets':[]
},{
    'start':'',
    'dest':'',
    'date':'',
    'tickets':[]
}]

export type TrainData={
    start:string
    dest:string
    date:string
    tickets:TrainTicketInfoArray
}

export type TrainDataArray=Array<TrainData>

type TicketCategoryPrice={
    type:string
    type_code:string
    price:number
    discount:number
}

export type TicketPrice={
    name:string
    short:string
    category:Array<TicketCategoryPrice>
    num:string
}

export type TrainTicketInfo={
    train_code:string
    train_feature:Array<string>
    start_time:string
    arrive_time:string
    lishi:string
    from_station:string
    to_station:string
    prices:Array<TicketPrice>
}

export type TrainTicketInfoArray=Array<TrainTicketInfo>
export const DEFAULT_TRAIN_TICKET_INFO={
    'train_code':'G520',
    'train_feature':[],
    'start_time':'12:00',
    'arrive_time':'18:32',
    'lishi':'06:32',
    'from_station':'上海虹桥',
    'to_station':'北京南站',
    'prices':[]
}