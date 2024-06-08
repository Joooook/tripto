<script setup lang="ts">
import { ref, watch } from 'vue'
import type { CheckboxValueType } from 'element-plus'

const value = defineModel()
const props =defineProps<{
    options:Array<{
        value:string
        label:string
    }>
}>()
const checkAll = ref(true)
const indeterminate = ref(false)

watch(value, (val) => {
    if (val.length === 0) {
        checkAll.value = false
        indeterminate.value = false
    } else if (val.length === props.options.length) {
        checkAll.value = true
        indeterminate.value = false
    } else {
        indeterminate.value = true
    }
})

const handleCheckAll = (val: CheckboxValueType) => {
    indeterminate.value = false
    if (val) {
        value.value = props.options.map((_) => _.value)
    } else {
        value.value = []
    }
}
</script>

<template>
    <el-select
        v-model="value"
        multiple
        collapse-tags
        collapse-tags-tooltip
        placeholder="选择"
        popper-class="custom-header"
        :max-collapse-tags="2"
    >
        <template #header>
            <el-checkbox
                v-model="checkAll"
                :indeterminate="indeterminate"
                @change="handleCheckAll"
            >
                全选
            </el-checkbox>
        </template>
        <el-option
            v-for="item in props.options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        />
    </el-select>
</template>

<style scoped>

</style>