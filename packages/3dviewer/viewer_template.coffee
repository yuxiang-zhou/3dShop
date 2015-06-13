Template.viewer3d.rendered = ->
    # container
    container = null
    renderer = null
    width = null
    height = null
    windowHalfX = width / 2
    windowHalfY = height / 2

    # control
    moveForward = false
    moveBackward = false
    zoomSpeed = 500

    # sence
    scene = null

    # camera
    ycam = 0
    camera = null

    # objects
    object = null

    # Clock
    clock = new THREE.Clock()
    # container
    container = Template.instance().$('.container3d').get(0)
    imgurl = container.getAttribute('src')
    imgHash = JSON.parse(container.getAttribute('data-db'))
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

    loader = new THREE.OBJMTLLoader(undefined, imgHash)

    # renderer
    renderer = new THREE.WebGLRenderer
    renderer.setPixelRatio window.devicePixelRatio
    renderer.setSize width, height

    onWindowResize = ->

        width = container.clientWidth
        height = container.clientHeight

        windowHalfX = width / 2
        windowHalfY = height / 2

        camera.aspect = width / height
        camera.updateProjectionMatrix

        renderer.setSize width, height

        # controls.handleResize()

    onMouseDown = (event) ->
        
        event.preventDefault()
        event.stopPropagation()

        switch event.button
            when 0 then moveForward = true
            when 2 then moveBackward = true

    onMouseUp = (event) ->
        
        event.preventDefault()
        event.stopPropagation()

        switch event.button
            when 0 then moveForward = false
            when 2 then moveBackward = false

    window.addEventListener 'resize', onWindowResize, false
    container.appendChild renderer.domElement
    container.addEventListener 'mousedown', onMouseDown, false
    container.addEventListener 'mouseup', onMouseUp, false

    animate = ->
        if renderer
            requestAnimationFrame animate
            render()

    render = ->
        delta = clock.getDelta()

        # controls.update delta
        object.rotation.y += delta

        if moveForward
            camera.position.z -= zoomSpeed*delta

        if moveBackward
            camera.position.z += zoomSpeed*delta

        renderer.render scene, camera

    # load obj
    loader.load imgurl, (( obj ) ->
            object = obj

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

            console.log 'Finished Loading'

            scene.add object

            animate()
        ), onProgress, onError