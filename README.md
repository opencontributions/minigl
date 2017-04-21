# minigl
## A lightweight JavaScript library for loading and animating textured 3D models in WebGL.

View a demo at [minigl.pro](https://minigl.pro/)

![Alt text](/screenshot.png?raw=true "Screenshot")

An experimental, minimal plain ES2015 JavaScript WebGL library for loading and animating textured 3D models.

#### Example usage:

````javascript
    var can = document.getElementById('can');
    var glCtx = can.getContext('webgl') || can.getContext('experimental-webgl');
    var shaders = ['webgl_demo/script_webgl/fragment.gl', 'webgl_demo/script_webgl/vertex.gl'];
    
    var webGl = new miniGL(glCtx);
    webGl.initProgram(shaders, function() {
        var drawers = this.createModel(
            ['webgl_demo/models_webgl/model_drawer.json'],
            ['webgl_demo/textures_webgl/texture_drawer.png'],
            {
                scale: {
                    x: 1,
                    y: 1,
                    z: 1
                },
                rotate: {
                    x: 0,
                    y: 0,
                    z: 0
                },
                translate: {
                    x: 0,
                    y: 0,
                    z: 0
                },
            },
            function(model) {
                if (this.rotate.y > Math.PI && model.translate.x < 1) {
                    model.translate.x += .01;
                }
                else if (model.translate.x > 0) {
                    model.translate.x -= .01;
                }
            }
        );
        this.init(function(world) {
            world.rotate.y = (performance.now() / 30000 * 2 * Math.PI) % Math.PI * 2;
        });
        this.animationLoop();
    });
````
