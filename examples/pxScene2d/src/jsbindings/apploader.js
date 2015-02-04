var px = require("./build/Debug/px");

function Api(scene) {
  this._scene = scene;
}

Api.prototype.loadScriptForScene = function(scene, scriptFile) {
  var sceneForChild = scene;
  var apiForChild = this;

  var fs = require('fs');

  var code = '';
  var infile = fs.createReadStream(scriptFile);
  infile.on('data', function(data) {
    code += data;
  });
  infile.on('end', function() {
    var vm = require('vm');
      var sandbox = { console: console, scene: sceneForChild, runtime: apiForChild };
    var app = vm.runInNewContext(code, sandbox);
  });
}

var scene = px.getScene(0, 0, 800, 400);
var api = new Api(scene);

// register a "global" hook that gets invoked whenever a child scene is created
scene.onScene = function(scene, url) {
    api.loadScriptForScene(scene, url);
};

var childScene = scene.createScene();
childScene.url = "childapp1.js";
childScene.parent = scene.root;

