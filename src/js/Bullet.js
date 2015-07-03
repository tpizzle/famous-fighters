var Node = require('famous/core/Node');
var Mesh = require('famous/webgl-renderables/Mesh');
var math = require('famous/math');
var Color = require('famous/utilities/Color');
var physics = require('famous/physics');
var Gravity1D = physics.Gravity1D;
var Gravity3D = physics.Gravity3D;
var Sphere = physics.Sphere;

function BulletView(game, ship, physBody) {
  this.physBody = physBody;
  this.node = game.addChild();
  this.node
      .setMountPoint(0.5, 0.5, 0.5)
      .setSizeMode(1, 1, 1)
      .setAbsoluteSize(50, 50, 50);
  this.node.setAlign(
    ship.node.getAlign()[0],
    ship.node.getAlign()[1],
    ship.node.getAlign()[2]
  );
}

function BulletSphere(ship, world) {
  var options = {
    mass: .5,
    radius: 1
  };
  this.sphere = new Sphere(options);
  this.sphere
      .setPosition(
        ship.body.position.x,
        ship.body.position.y,
        ship.body.position.z
      )
      .setForce(.1, .1, .1)
      .setMomentum(.45, .45, .45)
      .setVelocity(
        1*ship.body.getVelocity().x,
        1*ship.body.getVelocity().y,
        1*ship.body.getVelocity().z
        );
        // debugger;
}

BulletSphere.prototype.x = function() {
  return this.sphere.getPosition().x;
}

BulletSphere.prototype.y = function() {
  return this.sphere.getPosition().y;
}

BulletSphere.prototype.z = function() {
  return this.sphere.getPosition().z;
}

function BulletMesh(node) {
  this.skin = new Mesh(node);
  this.skin
      .setGeometry('Sphere', { detail: 50 })
      .setBaseColor(new Color('yellow'))
      ;
}

function Bullet(game, ship, world, asteroids) {
  this.world = world;
  this.ship = ship;
  this.physBody = new BulletSphere(ship, world);
  this.body = this.physBody.sphere;
  this.world.add(this.body);
  this.view = new BulletView(game, ship, this.physBody);
  this.node = this.view.node;
  this.mesh = new BulletMesh(this.node);
  this.asteroids = asteroids;
  this.update();
}

Bullet.prototype.isCollidedWith = function(asteroids) {
  var tooClose = false;
  this.asteroids.forEach(function(asteroid) {
    var diffs = [
      this.physBody.x() - asteroid.physBody.x(),
      this.physBody.y() - asteroid.physBody.y(),
      this.physBody.z() - asteroid.physBody.z()
    ];
    var dist = Math.pow(diffs[0],2) + Math.pow(diffs[1],2) + Math.pow(diffs[2], 2);
    var comparison = (dist <= this.body.radius + asteroid.physBody.radius());
    if (this !== asteroid && comparison === true) {
      tooClose = true;
    }
  }.bind(this));

  return tooClose;
}

Bullet.prototype.update = function(asteroids, time) {
  this.node.setPosition(
    this.physBody.x(),
    this.physBody.y(),
    this.physBody.z()
  );
  if (this.isCollidedWith(asteroids)) {
    console.log("Hit asteroid!");
  }
}

module.exports = Bullet;
