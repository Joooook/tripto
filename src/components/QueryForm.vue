<script lang="ts" setup>
import { ref} from 'vue'
import type { CascaderOptions } from '@/types/cascaderOptions'
import type { FormRules,FormInstance } from 'element-plus'
import { type QueryForm, DEFAULT_QUERY_FORM } from '@/types/queryForm'


interface RuleForm {
    start1: string
    start2: string
    dest: string
    date: string
}
const ruleFormRef = ref<FormInstance>()
const rules = ref<FormRules<RuleForm>>({
    start1: [
        { required: true, message: '请选择出发地'},
    ],
    start2: [
        { required: true, message: '请选择出发地' },
    ],
    dest: [
        { required: true, message: '请选择目的地'},
    ],
    date: [
        { required: true, message: '请选择出发时间'},
    ]
})

const queryForm = ref<QueryForm>(DEFAULT_QUERY_FORM)
const emit = defineEmits(['submitQueryForm'])
const props =defineProps<{
    cityOptions: CascaderOptions,
}>()
const cascaderProps = {
    expandTrigger: 'hover' as const,
    emitPath: false
}
const disabledDate = (time: Date) => {
    return time.getTime() < Date.now()
}

const submitQueryForm = async (formEl) => {
    if (!formEl) return
    formEl.validate((valid) => {
        if (valid) {
            emit('submitQueryForm', queryForm.value)
        } else {
            console.log('表单校验不通过')
        }
    })
}


</script>

<template>
    <el-form :model="queryForm" label-width="auto" :rules="rules" ref="ruleFormRef" status-icon>
        <el-form-item label="起点一" required prop="start1" >
            <el-cascader v-model="queryForm.start1" :options="props.cityOptions" :props="cascaderProps"
                         :show-all-levels="false"/>
        </el-form-item>
        <el-form-item label="起点二" required prop="start2" >
            <el-cascader v-model="queryForm.start2" :options="props.cityOptions" :props="cascaderProps"
                         :show-all-levels="false" />
        </el-form-item>
        <el-form-item label="目的地" required prop="dest" >
            <el-cascader v-model="queryForm.dest" :options="props.cityOptions" :props="cascaderProps"
                         :show-all-levels="false" />
        </el-form-item>
        <el-form-item label="出发时间" required prop="date">
            <el-date-picker
                v-model="queryForm.date"
                type="date"
                placeholder="选择出发日期"
                :disabled-date="disabledDate"
                value-format="YYYY-MM-DD"
            />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitQueryForm(ruleFormRef)">搜索</el-button>
        </el-form-item>
    </el-form>
</template>

<style></style>
