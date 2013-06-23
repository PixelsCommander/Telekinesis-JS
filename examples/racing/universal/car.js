/**
 * Created with JetBrains PhpStorm.
 * User: denisradin
 * Date: 02.06.13
 * Time: 0:02
 * Handles cars
 */

var globalObject = {};

(function (w) {
    w.Car = function (options) {
        var options = options || {};
        this.idealxvelocity = 0;
        this.idealyvelocity = 0;
        this.xvelocity = 0;
        this.yvelocity = 0;
        this.tspeed = 0;
        this.steering = 0;
        this.x = 0;
        this.y = 0;
        this.angle = 0;
        this.rotation = 0;
        this.cachex = 0;
        this.cachey = 0;
        this.tfriction = 0.1;
        this.acceleration = 15;
        this.steeringAmount = 4;

        if (w.flash) {
            this.setImage(library.get('car'));
            this.setRotationCenter();
        }
    }


    var p = w.Car.prototype;

    if(w.flash !== undefined){
        p = w.Car.prototype = new DisplayObject();
    }

    p.enumerable = [
        'class',
        'id',
        'angle',
        'speed',
        'x',
        'y',
        'idealxvelocity',
        'idealyvelocity',
        'xvelocity',
        'yvelocity',
        'tspeed',
        'steering',
        'cachex',
        'cachey',
        '_angle',
        'rotation'
    ];

    p.sync = [
        'angle',
        'speed',
        'x',
        'y',
        'idealxvelocity',
        'idealyvelocity',
        'xvelocity',
        'yvelocity',
        'tspeed',
        'steering',
        'cachex',
        'cachey',
        '_angle',
        'rotation'
    ];

    p.group = 'cars';
    p.class = 'Car';

    p.update = function () {
        if (this.keySpace) {
            if (this.steering > 0) {
                this.steering = 3.75;
            } else {
                this.steering = -3.75;
            }
        } else {
            // By pushing on certain keys, you get acceleration and decceleration
            if (this.keyup) {
                this.tspeed += this.acceleration;
            }
            if (this.keydown) {
                this.tspeed -= 1.5;
                if (this.tspeed < -7.5) {
                    this.tspeed = -7.5;
                }
            }
            this.tspeed *= 0.5;
        }

        // Velocity Change
        this.idealxvelocity = this.tspeed * Math.cos(this.angle * Math.PI / 180);
        this.idealyvelocity = this.tspeed * Math.sin(this.angle * Math.PI / 180);
        // By taking the difference between the current velocity and ideal velocity,
        // you get the actual velocity
        // When you apply the friction, you get the actual velocities.
        this.xvelocity += ((this.idealxvelocity - this.xvelocity) * this.tfriction);
        this.yvelocity += ((this.idealyvelocity - this.yvelocity) * this.tfriction);
        // By adding the velocities, you can get the new x and y positions
        this.cachex += this.xvelocity;
        this.cachey += this.yvelocity;
        // By pushing the Left and Right keys, the car steers in that direction
        if (this.keyleft || this.keyright) {
            this.steering += this.steeringAmount * (this.keyright - this.keyleft);
        } else {
            // When you let go of the Left and Right keys, the car goes back to going straight
            this.steering += ((this.steering < 0) - (this.steering > 0));
        }
        // You want to make sure that when you steer that it doesn't start turning faster and faster
        if (this.steering < -6) {
            this.steering = -6;
        }
        if (this.steering > 6) {
            this.steering = 6;
        }
        // Now you can make the car turn based on actual speed and turning angle
        actualSpeed = Math.sqrt((this.xvelocity * this.xvelocity) + (this.yvelocity * this.yvelocity));
        this.angle += ((this.steering * actualSpeed) * .1);
        this._angle = (this.angle + 360) % 360 - 270;

        // You need to update the angles from radians to degrees so that it can turn
        this.rotation = this._angle;//(360 - this.angle + 270);
        this.x = this.cachex;
        this.y = this.cachey;

        if (w.flash && this.stage.followObjectWithCamera === this){
            this.stage.x = -this.x + this.stage.width / 2;
            this.stage.y = -this.y + this.stage.height / 2;
        }
    }


    //Network actions handlers
    a = p.actions = {};

    a.accelerationStart = function () {
        this.keyup = 1
        this.keydown = 0;
    }

    a.accelerationStop = function () {
        this.keyup = 0;
    }

    a.breakStart = function () {
        this.keydown = 1;
        this.keyup = 0;
    }

    a.breakStop = function () {
        this.keydown = 0;
    }

    a.leftStart = function () {
        this.keyleft = 1;
        this.keyright = 0;
    }

    a.leftStop = function () {
        this.keyleft = 0;
    }

    a.rightStart = function () {
        this.keyright = 1;
        this.keyleft = 0;
    }

    a.rightStop = function () {
        this.keyright = 0;
    }

})(typeof exports === 'undefined' ? window : exports);