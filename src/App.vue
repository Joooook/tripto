<script lang="ts" setup>
import 'element-plus/theme-chalk/el-notification.css'
import '@/assets/css/card.css'
import QueryFormCard from '@/components/QueryForm.vue';
import ResultTableCard from '@/components/ResultTable.vue';
import { getCurrentInstance, ref, provide } from 'vue'
import axios from 'axios'
import { ElNotification } from 'element-plus'
import {  QueryForm } from '@/types/queryForm'
import { Setting } from '@element-plus/icons-vue'
import type { GetCityResponse, GetCityResponseData } from '@/types/api/train/city'
import type { CascaderOptions } from '@/types/cascaderOptions'
import { DEFAULT_TRAIN_TICKETS_DATA, GetTrainTicketsData } from '@/types/trainTickets'
import TrainTicketInfoCard from '@/components/TrainTicketInfoCard.vue'


const cityOptions = ref(Array())
const cityCodes= ref({})
const isQueryShow = ref(true)
const isResultShow = ref(true)
const apiUrl = getCurrentInstance()!.appContext.config.globalProperties.$apiUrl
const trainTickets = ref<GetTrainTicketsData>(DEFAULT_TRAIN_TICKETS_DATA)

function selectMenu(index: string) {
    isQueryShow.value = index === 'query';
}
async function getCities() {
    try {
        const response = await axios.get(apiUrl + '/train/cities')
        return response.data
    } catch (error) {
        console.error(error)
    }
}

function sortCityData(data: GetCityResponseData): CascaderOptions {
    let sortedCity = []
    for (let i of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') {
        let children = []
        for (let city of data) {
            if (city.station_short[0].toUpperCase() === i) {
                children.push({ 'value': city.city, 'label': city.city })
            }
        }
        if (children.length > 0) {    // 空的字母索引就不加入列表
            sortedCity.push({ 'value': i, 'label': i, 'children': children })
        }
    }
    return sortedCity
}

function initCityCode(data: GetCityResponseData) {
    let res={};
    for(let city of data){
        res[city.city]=city.station_code
    }
    return res
}

function getCityOptions() {
    getCities().then((res: GetCityResponse) => {
        if (res.code === 1) {
            ElNotification.error({
                title: 'Error',
                message: res.message
            })
        } else {
            if (res.data) {
                cityCodes.value = initCityCode(res.data)
                cityOptions.value = sortCityData(res.data)
            }
        }
    })
}

async function getTrainTickets(form:QueryForm) {
    try {
        let params = {
            start1:cityCodes.value[form.start1],
            start2:cityCodes.value[form.start2],
            dest:cityCodes.value[form.dest],
            date:form.date
        }
        const response = await axios.get(apiUrl + '/train/tickets' ,{params:params})
        return response.data
    } catch (error) {
        console.error(error)
    }
}

function search(form:QueryForm) {
    getTrainTickets(form).then((res) => {
        switch (res.code){
            case 0:
                trainTickets.value = res.data
                break
            case 1:
                ElNotification.error({
                    title: 'Error',
                    message: res.message
                })
                break
            case 2:
                ElNotification.warning({
                    title: 'Warning',
                    message: res.message
                })
                break
        }
    })
    isResultShow.value = true
}
getCityOptions()


provide('closeResultTable', () => {
    isResultShow.value = false
})
</script>

<template>
    <el-container>
        <el-aside width="auto">
            <el-menu default-active="query" @select="selectMenu">
                <el-menu-item index="query">
                    <el-icon>
                        <Search />
                    </el-icon>
                </el-menu-item>
                <el-menu-item index="setting">
                    <el-icon>
                        <setting />
                    </el-icon>
                </el-menu-item>
            </el-menu>
        </el-aside>
        <el-main>
            <el-row :gutter="20" justify="space-between">
                <el-col :span="6">
                    <transition name="el-fade-in">
                        <div v-show="isQueryShow" class="query-card">
                            <QueryFormCard @submit-query-form="search" :city-options="cityOptions"></QueryFormCard>
                        </div>
                    </transition>
                </el-col>
                <el-col :span="10">
                    <transition name="el-fade-in">
                        <div v-show="isResultShow" class="result-card" >
                            <ResultTableCard :train-tickets="trainTickets" />
                        </div>
                    </transition>
                </el-col>
            </el-row>
            <TrainTicketInfoCard/>

        </el-main>
    </el-container>
</template>

<style></style>
