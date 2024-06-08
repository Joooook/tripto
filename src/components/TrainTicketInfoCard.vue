<script setup lang="ts">
import '@/assets/css/ticketInfoCard.css'
import { TicketPrice, TrainTicketInfo } from '@/types/trainTickets'
import { ref } from 'vue'

const props = defineProps<{
    trainTicketInfo: TrainTicketInfo
}>()
const backgroundStyle=ref("")
const cheapestPrice=ref(getCheapestPrice(props.trainTicketInfo.prices))
function getCheapestPrice( ticketPrices:Array<TicketPrice>):string{
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
    if(price==-1){
        return '停运'
    }
    return price.toString()
}

function ConvertLishi(lishi: string): string {
    let res = ''
    let m = parseInt(lishi.split(':')[1])
    let h = parseInt(lishi.split(':')[0]) % 24
    let d = Math.floor(parseInt(lishi.split(':')[0]) / 24)
    if (d > 0) {
        res += d.toString() + '天'
    }
    if (h > 0) {
        res += h.toString() + '时'
    }
    res += m.toString() + '分'
    return res
}

function highlight(){
    backgroundStyle.value="background-color: #FFFBF2;"
}
function clearHighlight(){
    backgroundStyle.value="background-color: ;"
}


</script>

<template>
    <div class="ticket-info" @mouseover="highlight" @mouseleave="clearHighlight" :style="backgroundStyle">
        <el-row justify="space-between">
            <el-col :span="18">
                <div class="info">
                    <div class="info-left">
                        <div class="time" id="start_time">{{ props.trainTicketInfo.start_time }}</div>
                        <div class="station" id="start_station">{{ props.trainTicketInfo.from_station }}</div>
                    </div>
                    <div class="info-mid">
                        <div class="lishi">{{ ConvertLishi(props.trainTicketInfo.lishi) }}</div>
                        <div class="train-code">{{ props.trainTicketInfo.train_code }}</div>
                    </div>
                    <div class="info-right">
                        <div class="time">{{ props.trainTicketInfo.arrive_time }}</div>
                        <div class="station">{{ props.trainTicketInfo.to_station }}</div>
                    </div>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="money">
                    <span class="money-flag">￥</span>
                    <span class="money-amount">{{ cheapestPrice }}</span>
                </div>

            </el-col>
        </el-row>
        <el-row >
            <el-col :span="6" v-for="ticketPrice in props.trainTicketInfo.prices" :key="ticketPrice.name"><span class="seat-type">{{ticketPrice.name}}</span><span class="seat-left">{{ticketPrice.num}}</span></el-col>
        </el-row>
    </div>

</template>

<style scoped>

</style>