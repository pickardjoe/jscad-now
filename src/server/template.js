var model = require(MODEL);
var client = require(CLIENT);

function loadCamera(camera) {
  if (camera) {
    window.sessionStorage.setItem("camera", JSON.stringify(camera));
  }

  return JSON.parse(window.sessionStorage.getItem("camera"));
}

client(GRIDSIZE, model.main || model, model.getParameterDefinitions, loadCamera);
