<script lang="ts" setup>
import AreaCodePoint from '@/assets/json/areaCodePoint.json';
import AreaCode from '@/assets/json/areaCode.json';
import 'element-plus/theme-chalk/el-notification.css'
import '@/assets/css/card.css'
import QueryFormCard from '@/components/QueryForm.vue'
import ResultTableCard from '@/components/ResultTable.vue'
import { getCurrentInstance, ref, provide } from 'vue'
import axios from 'axios'
import { ElNotification } from 'element-plus'
import { QueryForm } from '@/types/queryForm'
import { Setting } from '@element-plus/icons-vue'
import type { GetCityResponse, GetCityResponseData } from '@/types/api/train/city'
import type { CascaderOptions } from '@/types/cascaderOptions'
import { DEFAULT_TRAIN_TICKETS_DATA, TrainDataArray } from '@/types/trainTickets'
import { BaiduMap, BmCityList, BmlCurveLine, BmMarker, BmNavigation } from 'vue-baidu-map-3x'
import {BAIDU_MAP_AK} from '@/config/secret'
import {
    getCenter,
    getZoom
} from '@/utils/mapHelper'



const isQueryShow = ref(true)
const isResultShow = ref(true)
const apiUrl = getCurrentInstance()!.appContext.config.globalProperties.$apiUrl
const trainDataArray = ref<TrainDataArray>(DEFAULT_TRAIN_TICKETS_DATA)
const resultLoading = ref(false)
//地图变量
const curveLines=ref([])
const cityOptions = ref(Array())
const cityCodes = ref({})
const mapCenter=ref('北京')
const mapZoom=ref(12)



function selectMenu(index: string) {
    isQueryShow.value = index === 'query'
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
    let res = {}
    for (let city of data) {
        res[city.city] = city.station_code
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

async function getTrainTickets(form: QueryForm) {
    try {
        let params = {
            start1: cityCodes.value[form.start1],
            start2: cityCodes.value[form.start2],
            dest: cityCodes.value[form.dest],
            date: form.date
        }
        const response = await axios.get(apiUrl + '/train/tickets', { params: params })
        return response.data
    } catch (error) {
        console.error(error)
    }
}

function search(form: QueryForm) {
    pinCityAtMap([form.start1,form.start2],form.dest)
    getTrainTickets(form).then((res) => {
        switch (res.code) {
            case 0:
                trainDataArray.value = res.data
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
        resultLoading.value = false
    })
    resultLoading.value = true
    isResultShow.value = true
}

function getCodeByCity(cityName:string){
    for(let province of AreaCode){
        if(province['name'].includes(cityName)){
            return province['code']
        }
        for(let city of province['city']){
            if(city['name'].includes(cityName)){
                return city['code']
            }
            // for(let area of city['area']){
            //     if(area['name'].includes(cityName)){
            //         return area['code']
            //     }
            // }
        }
    }
    return '110000'
}
function pinCityAtMap(startList:Array<string>,dest:string){
    let res=[];
    let points=[];
    let destPoint=AreaCodePoint[getCodeByCity(dest)];
    points.push(destPoint)
    for(let cityName of startList){
        let startPoint=AreaCodePoint[getCodeByCity(cityName)];
        points.push(startPoint)
        res.push([startPoint,destPoint])
    }
    curveLines.value=res;
    mapZoom.value=getZoom(points);
    let centerPoint=getCenter(points);
    mapCenter.value={'lat':centerPoint.lat,'lng':centerPoint.lng+6}
}

getCityOptions()


provide('closeResultTable', () => {
    isResultShow.value = false
})
</script>

<template>
    <el-container style="height: 99vh;margin: -5px;">
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
            <div style="position: relative;margin: -20px">
                <baidu-map class="map" :center="mapCenter" :zoom="mapZoom" :ak="BAIDU_MAP_AK" draggable="true">
                    <div>
                        <bm-navigation anchor="BMAP_ANCHOR_BOTTOM_RIGHT"></bm-navigation>
                        <bm-city-list anchor="BMAP_ANCHOR_TOP_LEFT"></bm-city-list>
                    </div>
                    <div v-for="(curvePoints,index) of curveLines" :key="index">
                        <bml-curve-line  :points="curvePoints"/>
                        <bm-marker :position="curvePoints[0]"/>
                        <bm-marker :position="curvePoints[1]"/>
                    </div>
                </baidu-map>
                <div class="cards">
                    <div style="display: flex;justify-content: flex-start;">
                        <transition name="el-fade-in">
                            <div v-show="isQueryShow" class="query-card">
                                <QueryFormCard @submit-query-form="search" :city-options="cityOptions"></QueryFormCard>
                            </div>
                        </transition>
                    </div>
                    <div style="display: flex;justify-content: flex-end">
                        <transition name="el-fade-in">
                            <div v-show="isResultShow" class="result-card">
                                <ResultTableCard :train-data-array="trainDataArray" :loading="resultLoading" />
                            </div>
                        </transition>
                    </div>
                </div>

            </div>


        </el-main>
    </el-container>
</template>

<style>

.map {
    position: absolute;
    top: 0;
    width: 100%;
    height: 99vh;

}

</style>
