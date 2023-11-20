import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader";
import {TransformControls} from "three/examples/jsm/controls/TransformControls";
(function(a){
    function Third(){
        const self = this

    }
    Third.prototype={
        constructor:Third,
        init({elementId = "myThree"}={}){
            this.createRender(elementId);
            this.createScene();
            this.createCamera(elementId);
            this.createLight();
            this.initStats(elementId);
            this.render();
        },

        /**
         * 创建渲染器
         *
         * @param elementId html元素id
         */
        createRender(elementId) {
            // 获取dom对象
            const element = document.getElementById(elementId)
            // 创建渲染器
            this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true,logarithmicDepthBuffer : true})
            // 设置渲染区域尺寸
            this.renderer.setSize(element.clientWidth, element.clientHeight)
            // 显示阴影
            this.renderer.shadowMap.enabled = true
            // 阴影类型
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
            // 设置背景颜色
            this.renderer.setClearColor(0xCCFFFF, 0.7)
            // 添加到dom
            element.appendChild(this.renderer.domElement)
        },
        /**
         * 创建场景
         */
        createScene() {
            this.scene = new THREE.Scene()
            var path = "/skybox/"
            var format = ".jpg"
            var urls = [
                path + "px" + format,
                path + "nx" + format,
                path + "nz" + format,
                path + "pz" + format,
                path + "py" + format,
                path + "ny" + format,
            ]
            var textureCube = new THREE.CubeTextureLoader().load( urls );

            this.scene.background = textureCube; //作为背景贴图
        },
        /**
         * 创建相机
         * @param elementId html元素id
         */
        createCamera(elementId) {
            // 获取dom对象
            const element = document.getElementById(elementId)
            // 窗口宽度
            const width = element.clientWidth
            // 窗口高度
            const height = element.clientHeight
            const k = width / height
            // 透视相机
            this.camera = new THREE.PerspectiveCamera(35, k, 0.1, 50000)
            // 设置相机位置
            this.camera.position.set(5, 5, 3)
            // 设置Z轴朝上
            this.camera.up.set(0, 0, 1)
            this.createCameraControl();
        },
        /**
         * 相机控制器
         */
        createCameraControl(){
            // 设置Z轴朝上
            this.camera.up.set(0, 0, 1)
            // 添加相机控制器
            this.controls = new OrbitControls(this.camera, this.renderer.domElement)
            // 设置相机朝向
            this.controls.target = new THREE.Vector3(0, 0, 0)
            // 控制器更新
            this.controls.update()
        },
        /**
         * 创建灯光
         */
        createLight() {
            // 创建环境光
            const ambientLight = new THREE.AmbientLight(0xffffff, 1)
            ambientLight.name = "环境光"
            this.scene.add(ambientLight)
            // 创建聚光灯
            const directionalLight = new THREE.DirectionalLight(0xffffff, 2)
            directionalLight.name = "平行光1"
            directionalLight.position.set(150, 150, 500)
            directionalLight.castShadow = true;
            this.scene.add(directionalLight)
            const directionalLight2 = new THREE.DirectionalLight(0xffffff, 2)
            directionalLight2.name = "平行光2"
            directionalLight2.position.set(0, -150, 200)
            this.scene.add(directionalLight2)
            const directionalLight3 = new THREE.DirectionalLight(0xffffff, 2)
            directionalLight3.name = "平行光3"
            directionalLight3.position.set(-150, 150, 200)
            this.scene.add(directionalLight3)
        },
        /**
         * 添加拖拽控件
         */
        initDragControls() {
            let self = this;
            // 添加平移控件
            self.transformControls = new TransformControls(self.camera, self.renderer.domElement);
            self.transformControls.name="拖拽控件"
            self.scene.add(self.transformControls);
            self.transformControls.addEventListener('dragging-changed', function (event) {
                self.controls.enabled = !event.value;
            });
        },
        /**
         * 设置拖拽控件模式
         * @param name
         * @param mode
         */
        setDragMode(name,mode){
            if(!this.transformControls) this.initDragControls()
            if(this.transformControls.parent == null) this.scene.add(this.transformControls)
            if(this.transformControls && this.transformControls.object && this.transformControls.object.name == name && this.transformControls.mode == mode){
                this.transformControls.detach()
                return
            }
            this.transformControls.attach(this.scene.getObjectByName(name))
            this.transformControls.setSpace('local')
            console.log(name)
            this.transformControls.setMode(mode)
        },
        /**
         * 性能监视器
         */
        initStats(elementId) {
            this.stats = new Stats();
            this.stats.setMode(0);
            this.stats.domElement.style.position = 'absolute';
            this.stats.domElement.style.left = '2px';
            this.stats.domElement.style.top = '2px';
            this.stats.domElement.style.zIndex = 1;
            //将统计对象添加到对应的<div>元素中
            document.getElementById(elementId).appendChild(this.stats.domElement);
        },
        /**
         * 渲染函数，每帧更新
         */
        render(){
            // 渲染场景
            this.renderer.render(this.scene, this.camera)
            if(this.stats) this.stats.update()
            requestAnimationFrame(this.render.bind(this)) // 循环渲染，this绑定
        },
        /**
         * 加载glb模型
         * @param url
         * @param name
         * @param position
         * @param rotation
         * @param zooms
         */
        loadGlbModel({url,name,position=[0,0,0],rotation=[0,0,0],zooms=[1,1,1]}={}){
            const THIS = this;
            // 模型加载器
            let gltfLoader = new GLTFLoader();
            // glb模型解压器
            const dracoLoader = new DRACOLoader();
            dracoLoader.setDecoderPath('/draco/')
            dracoLoader.setDecoderConfig({type:'js'})
            dracoLoader.preload()
            gltfLoader.setDRACOLoader(dracoLoader)
            // 加载模型
            gltfLoader.load(url,(gltf)=>{
                gltf.scene.traverse(function (child) {
                    // 替换材质
                    if ( child.isMesh ) {
                        var prevMaterial = child.material;
                        child.material = new THREE.MeshLambertMaterial();
                        THREE.MeshBasicMaterial.prototype.copy.call(child.material,prevMaterial)
                        child.castShadow = true
                        child.receiveShadow = true
                    }
                })
                // 如果glb内有多个模型，分别加载到场景中
                for (let i = gltf.scene.children.length;i>0;i--) {
                    let child = gltf.scene.children[i-1]
                    THIS.scene.add(child)
                }
                THIS.setDragMode(name,"translate")
            })
        },

    }
    a.Third = Third

})(window);