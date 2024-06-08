<script lang="ts" setup>
import { inject } from 'vue'
import {  TrainDataArray  } from '@/types/trainTickets'
import '@/assets/css/card.css'
import TrainTicketList from '@/components/TrainTicketList.vue'

const props = defineProps<{
    trainDataArray: TrainDataArray,
    loading:boolean
}>()
const close = inject('closeResultTable')

</script>

<template>
    <el-button text @click="close">
        <el-icon>
            <Close />
        </el-icon>
    </el-button>
    <div class="result-tables" >
        <div class="result-table" v-for="trainData in props.trainDataArray" :key="trainData.start">
            <TrainTicketList  :train-data="trainData" :loading="props.loading"/>
        </div>
    </div>
</template>

<style scoped>

</style>