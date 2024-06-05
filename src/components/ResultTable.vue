<script lang="ts" setup>
import { inject } from 'vue'
import {GetTrainTicketsData} from '@/types/trainTickets'

const props = defineProps<{
    trainTickets: GetTrainTicketsData,
}>()
const close = inject('closeResultTable')

</script>

<template>
    <el-button text @click="close">
        <el-icon>
            <Close />
        </el-icon>
    </el-button>
    <el-row>
        <el-col :span="12">
            <el-descriptions direction="vertical">
                <el-descriptions-item label="出发地1">{{props.trainTickets[0].start}}</el-descriptions-item>
                <el-descriptions-item label="目的地">{{props.trainTickets[0].dest}}</el-descriptions-item>
                <el-descriptions-item label="出发时间">{{props.trainTickets[0].date}}</el-descriptions-item>
            </el-descriptions>
            <el-table :data="props.trainTickets[0].tickets" max-height="60vh">
                <el-table-column prop="station_train_code" label="车次" width="180" />
                <el-table-column prop="start_time" label="出发时间" width="180" />
                <el-table-column prop="arrive_time" label="到达时间" />
            </el-table>
        </el-col>
        <el-col :span="12">
            <el-descriptions direction="vertical">
                <el-descriptions-item label="出发地2">{{props.trainTickets[1].start}}</el-descriptions-item>
                <el-descriptions-item label="目的地">{{props.trainTickets[1].dest}}</el-descriptions-item>
                <el-descriptions-item label="出发时间">{{props.trainTickets[1].date}}</el-descriptions-item>
            </el-descriptions>
            <el-table :data="props.trainTickets[1].tickets" max-height="60vh">
                <el-table-column prop="station_train_code" label="车次" width="180" />
                <el-table-column prop="start_time" label="出发时间" width="180" />
                <el-table-column prop="arrive_time" label="到达时间" />
            </el-table>
        </el-col>
    </el-row>


</template>

<style scoped>

</style>