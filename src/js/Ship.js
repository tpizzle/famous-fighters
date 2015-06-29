var Node = require('famous/core/Node');
var Mesh = require('famous/webgl-renderables/Mesh');
var math = require('famous/math');
var Color = require('famous/utilities/Color');
var physics = require('famous/physics');
var Gravity1D = physics.Gravity1D;
var Gravity3D = physics.Gravity3D;
var Sphere = physics.Sphere;

function ShipView(game, body) {
  this.node = game.node.addChild();
  this.node
      .setOrigin(0.5, 0.5, 0.5)
      .setAlign(
        body.x()*.1,
        body.y()*.1,
        body.z()*.1
      )
      .setMountPoint(0.5, 0.5, 0.5)
      .setSizeMode(1, 1, 1)
      .setAbsoluteSize(50, 50, 50);
}

// function ShipSphere2(world) {
//   var options = {
//     mass: .5,
//     radius: 1
//   };
//   Sphere.call(this, options);
//   this
//       .setPosition(0.5, 0.5, 0.5)
//       .setForce(.1, .1, .1)
//       .setMomentum(.45, .45, .45)
//       .setVelocity(15,15,20);
// }

function ShipSphere(world) {
  var options = {
    mass: .5,
    radius: 1
  };
  this.sphere = new Sphere(options);
  this.sphere
      .setPosition(0.5, 0.5, 0.5)
      .setForce(.1, .1, .1)
      .setMomentum(.45, .45, .45)
      .setVelocity(15,15,20);
}

ShipSphere.prototype.x = function() {
  return this.sphere.getPosition().x;
}

ShipSphere.prototype.y = function() {
  return this.sphere.getPosition().y;
}

ShipSphere.prototype.z = function() {
  return this.sphere.getPosition().z;
}

function ShipMesh(node) {
  this.skin = new Mesh(node);
  this.skin
      .setGeometry('Sphere', { detail: 50 })
      .setBaseColor(new Color('red'))
      ;
}

function Ship(game, world) {
  this.world = world;
  this.physBody = new ShipSphere(world);
  // this.physBody2 = new ShipSphere2(world);
  this.world.add(this.physBody);
  this.view = new ShipView(game, this.physBody);
  this.node = this.view.node;
  this.body = this.physBody.sphere;
  this.mesh = new ShipMesh(this.node);
}

Ship.prototype.update = function() {
  this.node.setPosition(
    this.physBody.x(),
    this.physBody.y(),
    this.physBody.z()
  );
}

module.exports = Ship;
