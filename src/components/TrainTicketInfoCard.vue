<script setup lang="ts">

</script>

<template>
    <el-row justify="space-between">
        <el-col :span="18">
            <el-row justify="space-between">
                <el-col :span="8">123</el-col>
                <el-col :span="8">1234</el-col>
                <el-col :span="8" :align="end">123</el-col>
            </el-row>
        </el-col>
        <el-col :span="6">
            <p class="money-flag">￥</p><el-text size="large">{{1}}</el-text>
        </el-col>
    </el-row>
</template>

<style scoped>
.money-flag{
    color: red;
}
</style>