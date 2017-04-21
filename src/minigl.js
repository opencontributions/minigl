import mat4 from './vendor/gl-matrix/mat4';
import multiXhr from './multi-xhr';
class webglCanvas {
    constructor(glCtx) {
        this.glCtx = glCtx;
    }
    compileShader(shader, source) {
        this.glCtx.shaderSource(shader, source);
        this.glCtx.compileShader(shader);
        if (this.glCtx.getShaderParameter(shader, this.glCtx.COMPILE_STATUS) === false) {
            console.log(`failed to compile ${this.glCtx.getShaderInfoLog(shader)}`);
        }
    }
    texLoader(uris, cb) {
        const images = [];
        let loadRecurse = () => {
            const img = new Image();
            img.src = uris.shift();
            img.onload = () => {
                images.push(img);
                if (uris.length) {
                    loadRecurse();
                    return;
                }
                cb(images);
            };
        };
        loadRecurse();
    }
    modelDefaults(options) {
        const obj = {};
        const defaults = ['scale', 'translate', 'rotate', 'eye', 'light0Dir', 'light1Dir', 'light0Val', 'light1Val'];
        for (const i in defaults) {
            if (defaults[i] === 'scale') {
                obj[defaults[i]] = {x: 1, y: 1, z: 1};
            }
            else if (defaults[i] === 'eye') {
                obj[defaults[i]] = {x: 0, y: 0, z: -5};
            }
            else if (defaults[i] === 'light0Dir') {
                obj[defaults[i]] = {x: 1, y: 1, z: -1};
            }
            else if (defaults[i] === 'light1Dir') {
                obj[defaults[i]] = {x: -1, y: -.5, z: -.5};
            }
            else if (defaults[i] === 'light0Val') {
                obj[defaults[i]] = {r: .8, g: .8, b: .8};
            }
            else if (defaults[i] === 'light1Val') {
                obj[defaults[i]] = {r: .8, g: .8, b: .8};
            }
            else {
                obj[defaults[i]] = {x: 0, y: 0, z: 0};
            }
            if (options.hasOwnProperty(defaults[i]) === true) {
                for (const j in options[defaults[i]]) {
                    obj[defaults[i]][j] = options[defaults[i]][j];
                }
            }
        }
        return obj;
    }
    init(cbWorld) {
        this.cbWorld = cbWorld;
        const options = this.modelDefaults({});

        this.scale = options.scale;
        this.translate = options.translate;
        this.rotate = options.rotate;
        this.eye = options.eye;
        this.light0Dir = options.light0Dir;
        this.light1Dir = options.light1Dir;
        this.light0Val = options.light0Val;
        this.light1Val = options.light1Val;
    }
    initProgram(shaders, cb) {
        const initProgram = function(shaders) {
            const shaderFragmentSource = shaders[0];
            const shaderVertexSource = shaders[1];
            this.glCtx.enable(this.glCtx.DEPTH_TEST);
            this.glCtx.enable(this.glCtx.CULL_FACE);
            this.glCtx.frontFace(this.glCtx.CCW);
            this.glCtx.cullFace(this.glCtx.BACK);

            const shaderFragment = this.glCtx.createShader(this.glCtx.FRAGMENT_SHADER);
            const shaderVertex = this.glCtx.createShader(this.glCtx.VERTEX_SHADER);
            this.compileShader(shaderFragment, shaderFragmentSource);
            this.compileShader(shaderVertex, shaderVertexSource);
        
            this.shaderProgram = this.glCtx.createProgram();

            this.glCtx.attachShader(this.shaderProgram, shaderFragment);
            this.glCtx.attachShader(this.shaderProgram, shaderVertex);
            this.glCtx.linkProgram(this.shaderProgram);
        
            if (this.glCtx.getProgramParameter(this.shaderProgram, this.glCtx.LINK_STATUS) === false) {
                console.log(`failed to link program ${this.glCtx.getProgramInfoLog(this.shaderProgram)}`);
            }
            this.glCtx.validateProgram(this.shaderProgram);
            if (this.glCtx.getProgramParameter(this.shaderProgram, this.glCtx.VALIDATE_STATUS) === false) {
                console.error('error validating program', this.glCtx.getProgramInfoLog(this.shaderProgram));
                return;
            }

            this.glCtx.useProgram(this.shaderProgram);

            this.locationVertex = this.glCtx.getAttribLocation(this.shaderProgram, 'vertPosition');
            this.locationTexCoord = this.glCtx.getAttribLocation(this.shaderProgram, 'vertTexCoord');
            this.locationNormal = this.glCtx.getAttribLocation(this.shaderProgram, 'vertNormal');

            this.locationTexTransform = this.glCtx.getUniformLocation(this.shaderProgram, 'vertTexTransform');

            this.locationTransform = this.glCtx.getUniformLocation(this.shaderProgram, 'mTrans');
            this.locatonView = this.glCtx.getUniformLocation(this.shaderProgram, 'mView');
            this.locationWorld = this.glCtx.getUniformLocation(this.shaderProgram, 'mWorld');
            this.locationProjection = this.glCtx.getUniformLocation(this.shaderProgram, 'mProj');

            this.locationLight0Dir = this.glCtx.getUniformLocation(this.shaderProgram, 'uLight0Dir');
            this.locationLight0Val = this.glCtx.getUniformLocation(this.shaderProgram, 'uLight0Val');
            this.locationLight1Dir = this.glCtx.getUniformLocation(this.shaderProgram, 'uLight1Dir');
            this.locationLight1Val = this.glCtx.getUniformLocation(this.shaderProgram, 'uLight1Val');
            
            this.models = [];
            cb.call(this);
        };
        multiXhr(shaders, initProgram.bind(this));
    }
    createModel(models, textures, options, cb) {
        options = this.modelDefaults(options);
        const createModel = (model, texture) => {
            model = JSON.parse(model);

            model.matrixWorld = new Float32Array(16);
            model.matrixView = new Float32Array(16);
            model.matrixProjection = new Float32Array(16);
            model.cb = cb;

            model.matrixTransform = new Float32Array(16);
            model.matrixIdentity = new Float32Array(16);
            mat4.identity(model.matrixIdentity);

            model.bufferVertex =  this.glCtx.createBuffer();
            model.bufferTexCoord =  this.glCtx.createBuffer();
            model.bufferIndices =  this.glCtx.createBuffer();
            model.bufferNormal = this.glCtx.createBuffer();

            this.glCtx.bindBuffer(this.glCtx.ARRAY_BUFFER, model.bufferVertex);
            this.glCtx.bufferData(this.glCtx.ARRAY_BUFFER, new Float32Array(model.vertexPositions), this.glCtx.STATIC_DRAW);
            this.glCtx.vertexAttribPointer(this.locationVertex, 3, this.glCtx.FLOAT, this.glCtx.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
            this.glCtx.enableVertexAttribArray(this.locationVertex);

            this.glCtx.bindBuffer(this.glCtx.ARRAY_BUFFER, model.bufferTexCoord);

            this.glCtx.bufferData(this.glCtx.ARRAY_BUFFER, new Float32Array(model.vertexTextureCoords), this.glCtx.STATIC_DRAW);
            this.glCtx.vertexAttribPointer(this.locationTexCoord, 2, this.glCtx.FLOAT, this.glCtx.FALSE, 2 * Float32Array.BYTES_PER_ELEMENT, 0);
            this.glCtx.enableVertexAttribArray(this.locationTexCoord);

            this.glCtx.bindBuffer(this.glCtx.ARRAY_BUFFER, model.bufferNormal);
            this.glCtx.bufferData(this.glCtx.ARRAY_BUFFER, new Float32Array(model.vertexNormals), this.glCtx.STATIC_DRAW);
            this.glCtx.vertexAttribPointer(this.locationNormal, 3, this.glCtx.FLOAT, this.glCtx.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
            this.glCtx.enableVertexAttribArray(this.locationNormal);

            this.glCtx.bindBuffer(this.glCtx.ELEMENT_ARRAY_BUFFER, model.bufferIndices);
            this.glCtx.bufferData(this.glCtx.ELEMENT_ARRAY_BUFFER, new Uint16Array(model.indices), this.glCtx.STATIC_DRAW);
            model.texture = this.glCtx.createTexture();
            this.glCtx.bindTexture(this.glCtx.TEXTURE_2D, model.texture);
            this.glCtx.pixelStorei(this.glCtx.UNPACK_FLIP_Y_WEBGL, true);

            this.glCtx.texImage2D(this.glCtx.TEXTURE_2D, 0, this.glCtx.RGBA, this.glCtx.RGBA, this.glCtx.UNSIGNED_BYTE, texture);
            this.glCtx.texParameteri(this.glCtx.TEXTURE_2D, this.glCtx.TEXTURE_MAG_FILTER, this.glCtx.LINEAR);
            this.glCtx.texParameteri(this.glCtx.TEXTURE_2D, this.glCtx.TEXTURE_MIN_FILTER, this.glCtx.LINEAR_MIPMAP_NEAREST);
            this.glCtx.generateMipmap(this.glCtx.TEXTURE_2D);
            this.glCtx.bindTexture(this.glCtx.TEXTURE_2D, null);

            options = this.modelDefaults(options);
            model.scale = options.scale;
            model.translate = options.translate;
            model.rotate = options.rotate;


            this.models.push(model);
            this.draw();
        };
        multiXhr(models, (models) => {
            this.texLoader(textures, (textures) => {
                models.forEach(function(model, i) {
                    createModel(model, textures[i]);   
                }, this);
            });
        });
    }
    draw() {
        this.models.forEach(function(model) {
            this.glCtx.bindBuffer(this.glCtx.ARRAY_BUFFER, model.bufferVertex);
            this.glCtx.vertexAttribPointer(this.locationVertex, 3, this.glCtx.FLOAT, this.glCtx.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
            this.glCtx.bindBuffer(this.glCtx.ARRAY_BUFFER, model.bufferTexCoord);
            this.glCtx.vertexAttribPointer(this.locationTexCoord, 2, this.glCtx.FLOAT, this.glCtx.FALSE, 2 * Float32Array.BYTES_PER_ELEMENT, 0);
            this.glCtx.bindBuffer(this.glCtx.ARRAY_BUFFER, model.bufferNormal);
            this.glCtx.vertexAttribPointer(this.locationNormal, 3, this.glCtx.FLOAT, this.glCtx.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);

            mat4.lookAt(model.matrixView, [this.eye.x, this.eye.y, this.eye.z], [0, 0, 0], [0, 1, 0]);
            mat4.perspective(model.matrixProjection, 1.0472, 640 / 480, .1, 100.0);

            mat4.rotate(model.matrixTransform, model.matrixIdentity, model.rotate.x, [1, 0, 0]);
            mat4.rotate(model.matrixTransform, model.matrixTransform, model.rotate.y, [0, 1, 0]);
            mat4.rotate(model.matrixTransform, model.matrixTransform, model.rotate.z, [0, 0, 1]);
            mat4.translate(model.matrixTransform, model.matrixTransform, [model.translate.x, model.translate.y, model.translate.z]);
            mat4.scale(model.matrixTransform, model.matrixTransform, [model.scale.x, model.scale.y, model.scale.z]);

            this.cbWorld(this);
            model.cb.call(this, model);
            mat4.rotate(model.matrixWorld, model.matrixIdentity, this.rotate.x, [1, 0, 0]);
            mat4.rotate(model.matrixWorld, model.matrixWorld, this.rotate.y, [0, -1, 0]);
            mat4.rotate(model.matrixWorld, model.matrixWorld, this.rotate.z, [0, 0, 1]);
            mat4.translate(model.matrixWorld, model.matrixWorld, [this.translate.x, this.translate.y, this.translate.z]);
            mat4.scale(model.matrixWorld, model.matrixWorld, [this.scale.x, this.scale.y, this.scale.z]);

            this.glCtx.uniformMatrix4fv(this.locationTransform, this.glCtx.FALSE, model.matrixTransform);
            this.glCtx.uniformMatrix4fv(this.locatonView, this.glCtx.FALSE, model.matrixView);
            this.glCtx.uniformMatrix4fv(this.locationWorld, this.glCtx.FALSE, model.matrixWorld);
            this.glCtx.uniformMatrix4fv(this.locationProjection, this.glCtx.FALSE, model.matrixProjection);
            this.glCtx.uniform3f(this.locationLight0Dir, this.light0Dir.x, this.light0Dir.y, this.light0Dir.z);
            this.glCtx.uniform3f(this.locationLight0Val, this.light0Val.r, this.light0Val.g, this.light0Val.b);
            this.glCtx.uniform3f(this.locationLight1Dir, this.light1Dir.x, this.light1Dir.y, this.light1Dir.z);
            this.glCtx.uniform3f(this.locationLight1Val, this.light1Val.r, this.light1Val.g, this.light1Val.b);
            
            this.glCtx.bindTexture(this.glCtx.TEXTURE_2D, model.texture);

            this.glCtx.bindBuffer(this.glCtx.ELEMENT_ARRAY_BUFFER, model.bufferIndices);

            this.glCtx.drawElements(this.glCtx.TRIANGLES, model.indices.length, this.glCtx.UNSIGNED_SHORT, 0);

            this.glCtx.bindTexture(this.glCtx.TEXTURE_2D, null);
        }, this);

    }
    animationLoop() {
        this.draw();
        requestAnimationFrame(this.animationLoop.bind(this));
    }
}
export {webglCanvas as default};