Template.demo3d.helpers
    objects: ->
        objs = []

        # for i in [2..4]
        #     objs.push
        #         mymodel: [[{url:'models/'+i+'/'+i+'.obj'}]]

        # objs.push
        #     mymodel: [[{url:'models/'+0+'/'+0+'.obj'}]]

        objs.push
            mymodel: [[{url:'models/'+0+'/'+0+'.obj'}]]
        return objs
