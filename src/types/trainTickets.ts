type TrainTicket={}

type TrainTickets=Array<any>

export const DEFAULT_TRAIN_TICKETS_DATA:GetTrainTicketsData=[{
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

export type GetTrainTicketsData=Array<{
    start:string
    dest:string
    date:string
    tickets:TrainTickets
}>


export type TrainTicketInfo={}