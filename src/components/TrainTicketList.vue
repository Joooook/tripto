<script setup lang="ts">
import { TicketPrice, TrainData, TrainTicketInfo, TrainTicketInfoArray } from '@/types/trainTickets'
import TrainTicketInfoCard from '@/components/TrainTicketInfoCard.vue'
import { ref, watch } from 'vue'
import '@/assets/css/card.css'
import MultipleSelector from '@/components/MultipleSelector.vue'

const props = defineProps<{
    trainData: TrainData
    loading:boolean
}>()
const filterDict={
    'G':(trainTicketInfo:TrainTicketInfo)=>{return trainTicketInfo.train_code.startsWith('G')},
    'D':(trainTicketInfo:TrainTicketInfo)=>{return trainTicketInfo.train_code.startsWith('D')},
    'O':(trainTicketInfo:TrainTicketInfo)=>{return !trainTicketInfo.train_code.startsWith('G') && !trainTicketInfo.train_code.startsWith('D')}
}
const filterList=ref(['D','G','O']);
const sortReverse=ref(false);
const sortKey=ref('price');

function lishiToInt(lishi:string){
    let h=parseInt(lishi.split(':')[0]);
    let m=parseInt(lishi.split(':')[1]);
    return h*60+m;
}

function sortTickets(trainTicketInfoArray:TrainTicketInfoArray ,key,reverse:boolean=false){
    let sortFunc=()=>{};
    switch (key){
        case 'lishi':
            sortFunc=(e1:TrainTicketInfo,e2:TrainTicketInfo)=>{
                let t1=lishiToInt(e1.lishi)
                let t2=lishiToInt(e2.lishi)
                return reverse?t2-t1:t1-t2;
            }
            break
        case 'start_time':
            break
        case 'arrive_time':
            break
        case 'price':
        default:
            sortFunc=(e1,e2)=>{
                let p1=getCheapestPrice(e1.prices)
                let p2=getCheapestPrice(e2.prices)
                if (p1==-1){
                    return 1
                }
                if (p2==-1){
                    return -1
                }
                return reverse?p2-p1:p1-p2
            }
    }

    return trainTicketInfoArray.sort(sortFunc)
}

function filterTickets(trainTicketInfoArray:TrainTicketInfoArray,_selectedFromStations:Array<string>,_selectedToStations:Array<string>){
    return trainTicketInfoArray.filter((trainTicketInfo:TrainTicketInfo)=>{
        let res=false;
        for(let filter of filterList.value){
            res=res||filterDict[filter](trainTicketInfo)
        }
        res=res&&_selectedFromStations.includes(trainTicketInfo.from_station)&&_selectedToStations.includes(trainTicketInfo.to_station)
        return res
    })
}

function getCheapestPrice( ticketPrices:Array<TicketPrice> ):number{
    let price=-1;
    for (let ticketPrice of ticketPrices){
        for (let ticketPriceCategory of ticketPrice.category){
            if(price<0){
                price=ticketPriceCategory.price
            }
            else if(ticketPriceCategory.price < price){
                price=ticketPriceCategory.price
            }
        }
    }
    return price
}



function getFromStationSet(trainTicketInfos:TrainTicketInfoArray){
    return [...new Set(trainTicketInfos.map((_)=>_.from_station))]
}
function getToStationSet(trainTicketInfos:TrainTicketInfoArray){
    return [...new Set(trainTicketInfos.map((_)=>_.to_station))]
}


const fromStationSet=ref(getFromStationSet(props.trainData.tickets));
const toStationSet=ref(getToStationSet(props.trainData.tickets));
const selectedFromStations=ref(fromStationSet.value);
const selectedToStations=ref(toStationSet.value);

watch(()=>props.trainData,()=>{
    fromStationSet.value=getFromStationSet(props.trainData.tickets)
    toStationSet.value=getToStationSet(props.trainData.tickets)
    selectedFromStations.value=fromStationSet.value
    selectedToStations.value=toStationSet.value
})
</script>

<template>
        <el-descriptions direction="vertical">
            <el-descriptions-item label="出发地">{{ props.trainData.start }}</el-descriptions-item>
            <el-descriptions-item label="目的地">{{ props.trainData.dest }}</el-descriptions-item>
            <el-descriptions-item label="出发时间">{{ props.trainData.date }}</el-descriptions-item>
        </el-descriptions>
        <el-checkbox-group v-model="filterList">
            <el-checkbox label="动车" value="D" />
            <el-checkbox label="高铁" value="G" />
            <el-checkbox label="其他" value="O" />
        </el-checkbox-group>
        <el-radio-group v-model="sortKey">
            <el-radio value="price">价格</el-radio>
            <el-radio value="lishi">历时</el-radio>
            <el-switch v-model="sortReverse" active-text="逆序"/>
        </el-radio-group>
        <MultipleSelector v-model="selectedFromStations" :options="fromStationSet.map((_)=>{return {'label':_,'value':_}})"/>
        <MultipleSelector v-model="selectedToStations" :options="toStationSet.map((_)=>{return {'label':_,'value':_}})"/>
        <el-scrollbar style="margin-top: 10px" v-loading="props.loading">
            <div v-for="(trainTicketInfo,index) in sortTickets(filterTickets(props.trainData.tickets,selectedFromStations,selectedToStations),sortKey,sortReverse)" :key="index">
                <TrainTicketInfoCard  :train-ticket-info="trainTicketInfo"/>
            </div>
        </el-scrollbar>
</template>

<style scoped>

</style>