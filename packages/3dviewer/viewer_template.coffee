
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

    # array of Object3D
    mdlObjs = []

    # final object
    object = null

    # sence
    scene = null

    # camera
    ycam = 0
    camera = null

    # Clock
    clock = new THREE.Clock()
    # container
    container = Template.instance().$('.container3d').get(0)

    mdlArr = JSON.parse(container.getAttribute('models'))
    dataMapArr = JSON.parse(container.getAttribute('datamaps'))

    #imgurl = container.getAttribute('src')
    #imgHash = JSON.parse(container.getAttribute('data-db'))
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

    # when all 3D models are loaded
    onAllLoaded = ->
        if mdlObjs.length != mdlArr.length
            return

        object = new THREE.Object3D()
        sizex = 0
        sizey = 0
        sizez = 0

        # read human body model
        #ugly code
        body_mdl = mdlObjs[0]
        box = new THREE.Box3().setFromObject body_mdl

        # update the max size
        size = box.size()
        sizex = size.x if size.x > sizex
        sizey = size.y if size.y > sizey
        sizez = size.z if size.z > sizez

        # move to the center
        center = box.center()
        body_mdl.translateX -center.x
        body_mdl.translateY -center.y
        body_mdl.translateZ -center.z

        object.add body_mdl

        # read clothes models
        for obj in mdlObjs[1..]
            box = new THREE.Box3().setFromObject obj

            # update the max size
            size = box.size()
            sizex = size.x if size.x > sizex
            sizey = size.y if size.y > sizey
            sizez = size.z if size.z > sizez

            # move to the center
            # center = box.center()
            obj.translateX -center.x
            obj.translateY -center.y
            obj.translateZ -center.z

            object.add obj

        scene.add object

        camera.lookAt( new THREE.Vector3( 0, 0, 0 ) )
        camera.position.z = 1 + Math.max sizex, sizey, sizez
        console.log 'Finished Loading'

        animate()

    # load data
    for i in [0..mdlArr.length-1]
        dataMap = if dataMapArr then dataMapArr[i] else undefined
        loader = new THREE.OBJMTLLoader(undefined, dataMap)
        loader.load mdlArr[i], (( obj ) ->
                console.log "finish " + i
                mdlObjs.push obj
                onAllLoaded()
            ), onProgress, onError

    console.log("Done!!!!!!!!!");


