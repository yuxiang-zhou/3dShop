Template.viewer3d.rendered = ->
    @autorun ->
        # container
        container = null
        renderer = null
        width = null
        height = null
        windowHalfX = width / 2
        windowHalfY = height / 2

        # sence
        scene = null

        # camera
        ycam = 0
        camera = null

        # objects
        human = null
        moving_plane = null

        # texture
        texture = null
        texture1 = null
        
        # meshes
        mesh = null

        # control handler
        # controls = null

        # Clock
        clock = new THREE.Clock()

        init = ->
            # container
            container = Template.instance().$('.container3d').get(0)
            imgurl = container.getAttribute('src')
            width = container.clientWidth
            height = container.clientHeight

            # scene
            scene = new THREE.Scene()

            # camera
            camera = new THREE.PerspectiveCamera 60, width / height, 1, 20000

            # light
            ambient = new THREE.AmbientLight 0x777777
            scene.add ambient 

            directionalLight = new THREE.DirectionalLight 0xffeedd
            directionalLight.position.set 0, 1, 1
            scene.add directionalLight

            # model
            # loader initialise
            onProgress = (xhr) ->
                if xhr.lengthComputable
                    percentComplete = xhr.loaded / xhr.total * 100
                    console.log( Math.round(percentComplete, 2) + '% downloaded' )

            onError = (xhr) ->
                console.log 'error'

            THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader())
            loader = new THREE.OBJMTLLoader()

            # load obj
            loader.load imgurl, imgurl.replace(".obj",".mtl"), (( object ) ->
                    human = object

                    box = new THREE.Box3().setFromObject object

                    meanx = (box.min.x + box.max.x) / 2
                    meany = (box.min.y + box.max.y) / 2
                    meanz = (box.min.z + box.max.z) / 2

                    sizex = box.max.x - box.min.x
                    sizey = box.max.y - box.min.y
                    sizez = box.max.z - box.min.z



                    object.translateX -meanx
                    object.translateY -meany 
                    object.translateZ -meanz

                    camera.lookAt( new THREE.Vector3( 0, 0, 0 ) )
                    camera.position.z = 1 + Math.max sizex, sizey, sizez

                    # controls
                    # controls = new THREE.FirstPersonControls camera
                    # controls.movementSpeed = 500
                    # controls.lookSpeed = 0.1
                    # controls.target = object.position.copy

                    console.log 'Finished Loading'

                    scene.add object

                    animate()
                ), onProgress, onError
            
            # renderer
            renderer = new THREE.WebGLRenderer
            renderer.setPixelRatio window.devicePixelRatio
            renderer.setSize width, height

            window.addEventListener 'resize', onWindowResize, false
            container.appendChild renderer.domElement

        onWindowResize = ->

            width = container.clientWidth
            height = container.clientHeight

            windowHalfX = width / 2
            windowHalfY = height / 2

            camera.aspect = width / height
            camera.updateProjectionMatrix

            renderer.setSize width, height

            # controls.handleResize()

        animate = ->

            requestAnimationFrame animate
            render()

        render = ->
            delta = clock.getDelta()

            # controls.update delta
            human.rotation.y += 0.05 * Math.random()

            renderer.render scene, camera

        init()