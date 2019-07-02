$(function () {

    Physijs.scripts.worker = "js/physijs_worker.js";
    //Physijs.scripts.ammo = 'js/ammo.js';

    // jQuery
    var $document = $(document);
    var $threeJs = $("#threeJs");
    var $viewport = $("#viewport");
    // 定数
    //var IS_DEBUG_MODE = true;
    var IS_DEBUG_MODE = false;
    var WIRE_FRAME = false;
    //var WIRE_FRAME = true;
    var FPS = 30;
    var STAGE_WIDTH = 800;
    var STAGE_HEIGHT = 600;
    var KEYCODE_UP = 38;
    var KEYCODE_DOWN = 40;
    var KEYCODE_LEFT = 37;
    var KEYCODE_RIGHT = 39;
    var KEYCODE_SPACE = 32;
    var KEYCODE_SHIFT = 16;
    var MAP = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 4, 0, 0, 3, 4, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 4, 0, 0, 3, 4, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 0, 0, 0, 0, 1],
        [1, 0, 3, 0, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1],
        [1, 3, 0, 3, 0, 2, 0, 0, 2, 2, 2, 2, 0, 3, 2, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 1],
        [1, 0, 3, 0, 3, 2, 0, 0, 2, 0, 0, 2, 3, 0, 2, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 2, 0, 0, 2, 2, 2, 2, 0, 0, 2, 0, 0, 0, 0, 1],
        [1, 3, 0, 3, 0, 2, 0, 0, 2, 0, 0, 0, 0, 3, 2, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1],
        [1, 3, 3, 3, 3, 2, 0, 0, 2, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ];
    var MAP_BLOCK_SIZE = 10;
    var MAP_WIDTH = MAP_BLOCK_SIZE * MAP[0].length;
    var MAP_HEIGHT = MAP_BLOCK_SIZE * MAP.length;
    var MAP_CENTER_X = MAP_BLOCK_SIZE * MAP[0].length / 2;
    var MAP_CENTER_Z = MAP_BLOCK_SIZE * MAP.length / 2;
    var CAMERA_ANGLE_TOP = "camera_an gle_top"; // カメラアングル（車の上から）
    var CAMERA_ANGLE_BACK = "camera_angle_back"; // カメラアングル（車の後方から）
    var CAMERA_ANGLE_INSIDE = "camera_angle_inside"; // カメラアングル（運転席）
    var CAMERA_ANGLE_DEFAULT = CAMERA_ANGLE_BACK;
    var GRAVITY = -50;
    var CAR_MOTOR_VELOCITY = 30; // 目標速度
    var CAR_MOTOR_MAX_FORCE = 3000; // モーター出力
    var ROAD_BUMP = 2; // 道のでこぼこ
    //var ROAD_BUMP = 0; // 道のでこぼこ
    // 変数
    var threeJsScene = null;
    var threeJsBackground = null;
    var threeJsCource = null;
    var threeJsBoxes = [];
    var threeJsCar = null;
    var threeJsLight = null;
    var threeJsCamera = null;
    var threeJsRenderer = null;
    var threeJsAxis = null;
    var threeJsControls = null;

    /* ---------- アクション ---------- */

    var stats = new Stats();
    stats.domElement.style.position = "absolute";
    stats.domElement.style.top = "0px";
    stats.domElement.style.zIndex = 100;
    $viewport.append(stats.domElement);

    // シーン
    threeJsScene = new ThreeJsScene();
    // 背景
    threeJsBackground = new ThreeJsBackground({
        scene: threeJsScene.getScene()
    });
    // コース
    threeJsCource = new ThreeJsCource({
        scene: threeJsScene.getScene()
    });
    // 3D車
    threeJsCar = new ThreeJsCar({
        scene: threeJsScene.getScene(),
        x: 150,
        y: 12,
        z: 30
    });
    // 光源
    threeJsLight = new ThreeJsLight({
        scene: threeJsScene.getScene(),
        target: threeJsCar.getMesh()
    });
    // カメラ
    threeJsCamera = new ThreeJsCamera({
        target: threeJsCar.getMesh()
    });
    // レンダリング
    threeJsRenderer = new ThreeJsRenderer({
        $target: $threeJs,
        scene: threeJsScene.getScene(),
        camera: threeJsCamera.getCamera()
    });
    // デバッグモード
    if (IS_DEBUG_MODE) {
        threeJsAxis = new THREE.AxisHelper(1000);
        threeJsAxis.position.set(0, 0, 0);
        threeJsScene.add(threeJsAxis);
        threeJsControls = new THREE.OrbitControls(threeJsCamera.getCamera(), threeJsRenderer.getDomElement());
    }

    /* ---------- イベント ---------- */

    $document.keydown(function (e) {
        if (e.keyCode == KEYCODE_UP) {
            threeJsCar.moveForward();
        }
        if (e.keyCode == KEYCODE_DOWN) {
            threeJsCar.toBack();
        }
        if (e.keyCode == KEYCODE_LEFT) {
            threeJsCar.turnLeft();
        }
        if (e.keyCode == KEYCODE_RIGHT) {
            threeJsCar.turnRight();
        }
        if (e.keyCode == KEYCODE_SPACE) {
            threeJsCamera.changeMode();
        }
    });

    $document.keyup(function (e) {
        if (e.keyCode == KEYCODE_LEFT) {
            threeJsCar.clearTurnLeft();
        }
        if (e.keyCode == KEYCODE_RIGHT) {
            threeJsCar.clearTurnRight();
        }
        if (e.keyCode == KEYCODE_UP) {
            threeJsCar.clearMoveForward();
        }
        if (e.keyCode == KEYCODE_DOWN) {
            threeJsCar.clearToBack();
        }
    });

    setInterval(function () {
        threeJsScene.upDate();
        threeJsCamera.upDate();
        threeJsRenderer.upDate();
        if (stats) stats.update();
        if (threeJsControls) threeJsControls.update();
    }, 1000 / FPS);

    /* ---------- 共通関数 ---------- */

    function getRadianByRotation(rot) {
        return rot * Math.PI / 180;
    }

    /* ---------- ThreeJSモジュール ---------- */

    /**
     * ThreeJSシーン
     * @returns {{getScene: Function, add: Function, upDate: Function}}
     * @constructor
     */
    function ThreeJsScene() {

        var _scene = null;

        // コンストラクタ
        function _constructor() {
            _scene = new Physijs.Scene();
            if (!IS_DEBUG_MODE) _scene.fog = new THREE.FogExp2(0xaa8f46, 0.005);
            _scene.setGravity(new THREE.Vector3(0, GRAVITY, 0));
        }

        _constructor();

        return {
            getScene: getScene,
            add: add,
            upDate: upDate
        };

        // ---------- パブリックメソッド ---------- //

        function getScene() {
            return _scene;
        }

        function add(item) {
            _scene.add(item);
        }

        function upDate() {
            _scene.simulate(null, 2);
        }

    }

    /**
     * ThreeJS背景
     * @param params
     * @returns {{}}
     * @constructor
     */
    function ThreeJsBackground(params) {

        var _scene = params["scene"];
        var _meshField = null;
        var _meshSky = null;

        // コンストラクタ
        function _constructor() {
            var geometry = null;
            var texture = null;
            var material = null;
            // 地面
            geometry = new THREE.PlaneGeometry(MAP_WIDTH * 3, MAP_HEIGHT * 3);
            texture = new THREE.ImageUtils.loadTexture("images/field.jpg");
            material = new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.DoubleSide,
                bumpScale: 0.1,
                wireframe: WIRE_FRAME
            });
            _meshField = new THREE.Mesh(geometry, material);
            _meshField.position.set(MAP_CENTER_X, 0, MAP_CENTER_Z);
            _meshField.rotation.x = getRadianByRotation(90);
            _scene.add(_meshField);
            // 空
            geometry = new THREE.CylinderGeometry(MAP_WIDTH * 10, MAP_HEIGHT * 10, 2500, 8, 1, true);
            texture = new THREE.ImageUtils.loadTexture("images/sky.jpg");
            material = new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.BackSide,
                wireframe: WIRE_FRAME
            });
            _meshSky = new THREE.Mesh(geometry, material);
            _meshSky.position.set(MAP_CENTER_X, 300 / 2, MAP_CENTER_Z);
            _scene.add(_meshSky);
        }

        _constructor();

        return {};

    }

    /**
     * ThreeJSコース
     * @param params
     * @returns {{}}
     * @constructor
     */
    function ThreeJsCource(params) {

        var _scene = params["scene"];

        // コンストラクタ
        function _constructor() {
            var shape = null;
            var geometry = null;
            var texture = null;
            var material = null;
            var mesh = null;
            // コース
            geometry = new THREE.PlaneGeometry(MAP_WIDTH, MAP_HEIGHT, MAP[0].length, MAP.length);
            for (var i = 0; i < geometry.vertices.length; i++) {
                var vertex = geometry.vertices[i];
                vertex.z = Math.random() * ROAD_BUMP;
            }
            geometry.computeFaceNormals();
            geometry.computeVertexNormals();
            texture = THREE.ImageUtils.loadTexture("images/land01.jpg");
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(MAP[0].length / 4, MAP.length / 4);
            material = Physijs.createMaterial(new THREE.MeshLambertMaterial({
                map: texture,
                bumpMap: texture,
                bumpScale: 0.1,
                specular: 0xFFFFFF,
                shininess: 2000,
                wireframe: WIRE_FRAME
            }), 20, // 摩擦係数
                0.1 // 反発係数
            );
            mesh = new Physijs.HeightfieldMesh(geometry, material, 0, MAP[0].length, MAP.length);
            mesh.position.set(MAP_CENTER_X, 10, MAP_CENTER_Z);
            mesh.rotation.x = getRadianByRotation(-90);
            mesh.receiveShadow = true;
            _scene.add(mesh);
            // 壁（高）
            geometry = new THREE.CubeGeometry(MAP_BLOCK_SIZE, MAP_BLOCK_SIZE, MAP_BLOCK_SIZE);
            texture = new THREE.ImageUtils.loadTexture("images/wall01.jpg");
            material = new THREE.MeshPhongMaterial({
                map: texture,
                bumpMap: texture,
                bumpScale: 0.1,
                specular: 0xFFFFFF,
                shininess: 1000,
                wireframe: WIRE_FRAME
            });
            for (i = 0, max = MAP.length; i < max; i = i + 1) {
                for (j = 0, max2 = MAP[i].length; j < max2; j = j + 1) {
                    if (MAP[i][j] == 1) {
                        mesh = new Physijs.BoxMesh(geometry, material, 0);
                        mesh.position.set(MAP_BLOCK_SIZE * j + (MAP_BLOCK_SIZE / 2), MAP_BLOCK_SIZE / 2 + 10, MAP_BLOCK_SIZE * i + (MAP_BLOCK_SIZE / 2));
                        mesh.castShadow = true;
                        _scene.add(mesh);
                    }
                }
            }
            // 壁（低）
            geometry = new THREE.CubeGeometry(MAP_BLOCK_SIZE, MAP_BLOCK_SIZE, MAP_BLOCK_SIZE);
            texture = new THREE.ImageUtils.loadTexture("images/wall01.jpg");
            material = new THREE.MeshPhongMaterial({
                map: texture,
                bumpMap: texture,
                bumpScale: 0.1,
                specular: 0xFFFFFF,
                shininess: 1000,
                wireframe: WIRE_FRAME
            });
            for (i = 0, max = MAP.length; i < max; i = i + 1) {
                for (j = 0, max2 = MAP[i].length; j < max2; j = j + 1) {
                    if (MAP[i][j] == 2) {
                        mesh = new Physijs.BoxMesh(geometry, material, 0);
                        mesh.position.set(MAP_BLOCK_SIZE * j + (MAP_BLOCK_SIZE / 2), MAP_BLOCK_SIZE / 2 + 4, MAP_BLOCK_SIZE * i + (MAP_BLOCK_SIZE / 2));
                        mesh.castShadow = true;
                        _scene.add(mesh);
                    }
                }
            }
            // 箱
            geometry = new THREE.CubeGeometry(MAP_BLOCK_SIZE / 3, MAP_BLOCK_SIZE / 3, MAP_BLOCK_SIZE / 3);
            texture = new THREE.ImageUtils.loadTexture("images/box.jpg");
            material = Physijs.createMaterial(new THREE.MeshPhongMaterial({
                map: texture,
                bumpMap: texture,
                bumpScale: 0.1,
                specular: 0xFFFFFF,
                shininess: 1000,
                wireframe: WIRE_FRAME
            }), 1, // 摩擦係数
                1 // 反発係数
            );
            for (i = 0, max = MAP.length; i < max; i = i + 1) {
                for (j = 0, max2 = MAP[i].length; j < max2; j = j + 1) {
                    if (MAP[i][j] == 3) {
                        mesh = new Physijs.BoxMesh(geometry, material, 1);
                        mesh.position.set(MAP_BLOCK_SIZE * j + (MAP_BLOCK_SIZE / 2), MAP_BLOCK_SIZE / 2 + 11, MAP_BLOCK_SIZE * i + (MAP_BLOCK_SIZE / 2));
                        mesh.castShadow = true;
                        _scene.add(mesh);
                    }
                }
            }
            // ジャンプ台
            geometry = new THREE.CubeGeometry(MAP_BLOCK_SIZE, MAP_BLOCK_SIZE, MAP_BLOCK_SIZE);
            texture = new THREE.ImageUtils.loadTexture("images/wood01.jpg");
            material = Physijs.createMaterial(new THREE.MeshPhongMaterial({
                map: texture,
                bumpMap: texture,
                bumpScale: 0.1,
                specular: 0xFFFFFF,
                shininess: 1000,
                wireframe: WIRE_FRAME
            }), 50, // 摩擦係数
                0.1 // 反発係数
            );
            for (i = 0, max = MAP.length; i < max; i = i + 1) {
                for (j = 0, max2 = MAP[i].length; j < max2; j = j + 1) {
                    if (MAP[i][j] == 4) {
                        mesh = new Physijs.BoxMesh(geometry, material, 0);
                        mesh.rotation.set(0, 0, getRadianByRotation(60));
                        mesh.position.set(MAP_BLOCK_SIZE * j + (MAP_BLOCK_SIZE / 2), MAP_BLOCK_SIZE / 2 + 3, MAP_BLOCK_SIZE * i + (MAP_BLOCK_SIZE / 2));
                        mesh.castShadow = true;
                        _scene.add(mesh);
                    }
                }
            }
        }

        _constructor();

        return {};

    }

    /**
     * ThreeJS車
     * @param params
     * @returns {{getMesh: Function, turnLeft: Function, clearTurnLeft: Function, turnRight: Function, clearTurnRight: Function, moveForward: Function, clearMoveForward: Function, toBack: Function, clearToBack: Function}}
     * @constructor
     */
    function ThreeJsCar(params) {

        var _scene = params["scene"];
        var _x = params["x"] || 0;
        var _y = params["y"] || 0;
        var _z = params["z"] || 0;
        var _meshBody = null;
        var _meshWheelFrontLeft = null;
        var _meshWheelFrontRight = null;
        var _meshWheelBackLeft = null;
        var _meshWheelBackRight = null;
        var _meshWheelFrontLeftConstraint = null;
        var _meshWheelFrontRightConstraint = null;
        var _meshWheelBackLeftConstraint = null;
        var _meshWheelBackRightConstraint = null;

        // コンストラクタ
        function _constructor() {
            var geometry = null;
            var texture = null;
            var material = null;
            // 車（ボディ）
            geometry = new THREE.CubeGeometry(6, 1.5, 2);
            material = Physijs.createMaterial(new THREE.MeshPhongMaterial({color: 0xFF0000, ambient: 0xFF0000, metal: true, specular: 0xFFFFFF, shininess: 100}), 1, // 摩擦係数
                1 // 反発係数
            );
            _meshBody = new Physijs.BoxMesh(geometry, material, 3000);
            _meshBody.position.set(_x, _y + 2, _z);
            _meshBody.castShadow = true;
            _scene.add(_meshBody);
            // 車（タイヤ）
            geometry = new THREE.CylinderGeometry(1, 1, 1, 16);
            material = Physijs.createMaterial(new THREE.MeshPhongMaterial({color: 0x000000, ambient: 0x333333}), 100, // 摩擦係数
                0.5 // 反発係数
            );
            _meshWheelFrontLeft = new Physijs.CylinderMesh(geometry, material, 1000);
            _meshWheelFrontLeft.rotation.x = getRadianByRotation(90);
            _meshWheelFrontLeft.position.set(_x - 2, _y + 1, _z - 2);
            _meshWheelFrontLeft.castShadow = true;
            _scene.add(_meshWheelFrontLeft);
            //
            _meshWheelFrontRight = new Physijs.CylinderMesh(geometry, material, 1000);
            _meshWheelFrontRight.rotation.x = getRadianByRotation(90);
            _meshWheelFrontRight.position.set(_x - 2, _y + 1, _z + 2);
            _meshWheelFrontRight.castShadow = true;
            _scene.add(_meshWheelFrontRight);
            //
            _meshWheelBackLeft = new Physijs.CylinderMesh(geometry, material, 1000);
            _meshWheelBackLeft.rotation.x = getRadianByRotation(90);
            _meshWheelBackLeft.position.set(_x + 2, _y + 1, _z + 2);
            _meshWheelBackLeft.castShadow = true;
            _scene.add(_meshWheelBackLeft);
            //
            _meshWheelBackRight = new Physijs.CylinderMesh(geometry, material, 1000);
            _meshWheelBackRight.rotation.x = getRadianByRotation(90);
            _meshWheelBackRight.position.set(_x + 2, _y + 1, _z - 2);
            _meshWheelBackRight.castShadow = true;
            _scene.add(_meshWheelBackRight);
            //
            _meshWheelFrontLeftConstraint = new Physijs.DOFConstraint(_meshWheelFrontLeft, _meshBody, new THREE.Vector3(_x - 2, _y + 1, _z - 2));
            _scene.addConstraint(_meshWheelFrontLeftConstraint);
            _meshWheelFrontLeftConstraint.setAngularLowerLimit({x: 0, y: 0, z: 0});
            _meshWheelFrontLeftConstraint.setAngularUpperLimit({x: 0, y: 0});
            //
            _meshWheelFrontRightConstraint = new Physijs.DOFConstraint(_meshWheelFrontRight, _meshBody, new THREE.Vector3(_x - 2, _y + 1, _z + 2));
            _scene.addConstraint(_meshWheelFrontRightConstraint);
            _meshWheelFrontRightConstraint.setAngularLowerLimit({x: 0, y: 0, z: 0});
            _meshWheelFrontRightConstraint.setAngularUpperLimit({x: 0, y: 0});
            //
            _meshWheelBackLeftConstraint = new Physijs.DOFConstraint(_meshWheelBackLeft, _meshBody, new THREE.Vector3(_x + 2, _y + 1, _z + 2));
            _scene.addConstraint(_meshWheelBackLeftConstraint);
            _meshWheelBackLeftConstraint.setAngularLowerLimit({x: 0, y: 0, z: 0});
            _meshWheelBackLeftConstraint.setAngularUpperLimit({x: 0, y: 0, z: 0});
            //
            _meshWheelBackRightConstraint = new Physijs.DOFConstraint(_meshWheelBackRight, _meshBody, new THREE.Vector3(_x + 2, _y + 1, _z - 2));
            _scene.addConstraint(_meshWheelBackRightConstraint);
            _meshWheelBackRightConstraint.setAngularLowerLimit({x: 0, y: 0, z: 0});
            _meshWheelBackRightConstraint.setAngularUpperLimit({x: 0, y: 0, z: 0});
        }

        _constructor();

        return {
            getMesh: getMesh,
            turnLeft: turnLeft,
            clearTurnLeft: clearTurnLeft,
            turnRight: turnRight,
            clearTurnRight: clearTurnRight,
            moveForward: moveForward,
            clearMoveForward: clearMoveForward,
            toBack: toBack,
            clearToBack: clearToBack
        };

        // ---------- パブリックメソッド ---------- //

        function getMesh() {
            return _meshBody;
        }

        function turnLeft() {
            _meshWheelFrontLeftConstraint.configureAngularMotor(1, -Math.PI / 6, Math.PI / 6, CAR_MOTOR_VELOCITY / 5, CAR_MOTOR_MAX_FORCE / 10);
            _meshWheelFrontRightConstraint.configureAngularMotor(1, -Math.PI / 6, Math.PI / 6, CAR_MOTOR_VELOCITY / 5, CAR_MOTOR_MAX_FORCE / 10);
            _meshWheelFrontLeftConstraint.enableAngularMotor(1);
            _meshWheelFrontRightConstraint.enableAngularMotor(1);
        }

        function clearTurnLeft() {
            _meshWheelFrontLeftConstraint.configureAngularMotor(1, 0, 0, 0, 0);
            _meshWheelFrontRightConstraint.configureAngularMotor(1, 0, 0, 0, 0);
            _meshWheelFrontLeftConstraint.disableAngularMotor(1);
            _meshWheelFrontRightConstraint.disableAngularMotor(1);
        }

        function turnRight() {
            _meshWheelFrontLeftConstraint.configureAngularMotor(1, -Math.PI / 6, Math.PI / 6, -CAR_MOTOR_VELOCITY / 5, CAR_MOTOR_MAX_FORCE / 10);
            _meshWheelFrontRightConstraint.configureAngularMotor(1, -Math.PI / 6, Math.PI / 6, -CAR_MOTOR_VELOCITY / 5, CAR_MOTOR_MAX_FORCE / 10);
            _meshWheelFrontLeftConstraint.enableAngularMotor(1);
            _meshWheelFrontRightConstraint.enableAngularMotor(1);
        }

        function clearTurnRight() {
            _meshWheelFrontLeftConstraint.configureAngularMotor(1, 0, 0, 0, 0);
            _meshWheelFrontRightConstraint.configureAngularMotor(1, 0, 0, 0, 0);
            _meshWheelFrontLeftConstraint.disableAngularMotor(1);
            _meshWheelFrontRightConstraint.disableAngularMotor(1);
        }

        function moveForward() {
            _meshWheelBackLeftConstraint.configureAngularMotor(2, 1, 0, CAR_MOTOR_VELOCITY, CAR_MOTOR_MAX_FORCE);
            _meshWheelBackRightConstraint.configureAngularMotor(2, 1, 0, CAR_MOTOR_VELOCITY, CAR_MOTOR_MAX_FORCE);
            _meshWheelBackLeftConstraint.enableAngularMotor(2);
            _meshWheelBackRightConstraint.enableAngularMotor(2);
        }

        function clearMoveForward() {
            _meshWheelBackLeftConstraint.configureAngularMotor(2, 1, 0, 0, 0);
            _meshWheelBackRightConstraint.configureAngularMotor(2, 1, 0, 0, 0);
            _meshWheelBackLeftConstraint.disableAngularMotor(2);
            _meshWheelBackRightConstraint.disableAngularMotor(2);
        }

        function toBack() {
            _meshWheelBackLeftConstraint.configureAngularMotor(2, 1, 0, -CAR_MOTOR_VELOCITY, CAR_MOTOR_MAX_FORCE);
            _meshWheelBackRightConstraint.configureAngularMotor(2, 1, 0, -CAR_MOTOR_VELOCITY, CAR_MOTOR_MAX_FORCE);
            _meshWheelBackLeftConstraint.enableAngularMotor(2);
            _meshWheelBackRightConstraint.enableAngularMotor(2);
        }

        function clearToBack() {
            _meshWheelBackLeftConstraint.disableAngularMotor(2);
            _meshWheelBackRightConstraint.disableAngularMotor(2);
        }

    }

    /**
     * ThreeJSライト
     * @param params
     * @returns {{}}
     * @constructor
     */
    function ThreeJsLight(params) {

        var _scene = params["scene"];
        var _target = params["target"];
        var _spot = null;
        var _ambient = null;

        // コンストラクタ
        function _constructor() {
            // スポットライト
            _spot = new THREE.SpotLight(0xFFFFFF, 1, 1000, Math.PI / 1, 20);
            _spot.position.set(MAP_CENTER_X, 200, MAP_CENTER_Z);
            _spot.castShadow = true;
            _spot.target = _target;
            if (IS_DEBUG_MODE) _spot.shadowCameraVisible = true;
            _scene.add(_spot);
            // 環境光
            _ambient = new THREE.AmbientLight(0x888888);
            _scene.add(_ambient);
        }

        _constructor();

        return {};

    }

    /**
     * ThreeJSカメラ
     * @param params
     * @returns {{getCamera: Function, changeMode: Function, upDate: Function}}
     * @constructor
     */
    function ThreeJsCamera(params) {

        var _target = params["target"];
        var _camera = null;
        var _mode = CAMERA_ANGLE_DEFAULT;

        // コンストラクタ
        function _constructor() {
            _camera = new THREE.PerspectiveCamera(45, STAGE_WIDTH / STAGE_HEIGHT, 1, 10000);
        }

        _constructor();

        return {
            getCamera: getCamera,
            changeMode: changeMode,
            upDate: upDate
        };

        // ---------- パブリックメソッド ---------- //

        function getCamera() {
            return _camera;
        }

        function changeMode() {
            switch (_mode) {
                case CAMERA_ANGLE_TOP:
                    _mode = CAMERA_ANGLE_BACK;
                    break;
                case CAMERA_ANGLE_BACK:
                    _mode = CAMERA_ANGLE_INSIDE;
                    break;
                case CAMERA_ANGLE_INSIDE:
                    _mode = CAMERA_ANGLE_TOP;
                    break;
            }
        }

        function upDate() {
            if (IS_DEBUG_MODE) return;
            //
            var x = _target.position.x;
            var y = _target.position.y;
            var z = _target.position.z;
            //
            if (_mode == CAMERA_ANGLE_TOP) {
                _camera.position.x = x + 40;
                _camera.position.y = 20;
                _camera.position.z = z;
                _camera.lookAt(_target.position);
            } else if (_mode == CAMERA_ANGLE_BACK) {
                _camera.position.x = x + 50;
                _camera.position.y = 50;
                _camera.position.z = z;
                _camera.lookAt(_target.position);
            } else if (_mode == CAMERA_ANGLE_INSIDE) {
                _camera.position.x = x;
                _camera.position.y = 100;
                _camera.position.z = z;
                _camera.lookAt(_target.position);
            }
        }

    }

    /**
     * ThreeJSレンダラ
     * @param params
     * @returns {{getDomElement: Function, upDate: Function}}
     * @constructor
     */
    function ThreeJsRenderer(params) {

        var _$target = params["$target"];
        var _scene = params["scene"];
        var _camera = params["camera"];
        var _renderer = null;
        var _domElement = null;

        // コンストラクタ
        function _constructor() {
            _renderer = new THREE.WebGLRenderer({antialias: true});
            _renderer.setSize(STAGE_WIDTH, STAGE_HEIGHT);
            _renderer.setClearColor(0x000000, 1);
            _renderer.shadowMapEnabled = true;
            _renderer.shadowMapSoft = true;
            _domElement = _renderer.domElement;
            _$target.append(_domElement);
        }

        _constructor();

        return {
            getDomElement: getDomElement,
            upDate: upDate
        };

        // ---------- パブリックメソッド ---------- //

        function getDomElement() {
            return _domElement;
        }

        function upDate() {
            _renderer.render(_scene, _camera);
        }

    }

});
