<template>
  <div id="myThree"></div>
</template>

<script>
import "../utils/Third.js"
import * as THREE from "three"
var third = new Third()
export default {
  name: "DigitalTwin",
  mounted() {
    // 场景初始化
    third.init({elementId:"myThree"})
    // 添加网格地板
    var gridHelper = new THREE.GridHelper( 26, 26, 0x0c0c0c, 0x5B5B5B );
    gridHelper.name = "网格地板"
    gridHelper.rotation.x = 90*Math.PI/180;
    third.scene.add(gridHelper);
    // 加载模型
    third.loadGlbModel({url:"/model/ER20.glb",name:"ER20"})
    // 打印场景信息
    console.log(third.scene)
  }
}
</script>

<style scoped>
#myThree{
  height: 100%;
  width: 100%;
}
</style>