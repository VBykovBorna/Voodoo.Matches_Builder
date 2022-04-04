import {DisplayObject, FontAlign, FontStyle, FontWeight, GameObject, Graphics, MessageDispatcher, TextField} from "black-engine";
import * as planck from 'planck-js';
import PhysicsOption from "../../physics/physics-options";

export default class Match extends DisplayObject {
  constructor(physics) {
    super();

    this._physics = physics;

    this._width = 10;
    this._height = 100;

    this._view = null;
    this._body = null;

    this._init();
  }

  // activate() {
  //   this._body.setActive(true);
  // }

  // deactivate() {
  //   this._body.setActive(false);
  // }

  setPos(pos) {
    const s = PhysicsOption.worldScale;
    pos.x /= s;
    pos.y /= s;

    this._body.setPosition(pos);
  }

  _init() {
    this._initView();
    this._initBody();
  }

  _initView() {
    const width = this._width;
    const height = this._height;

    const view = this._view = new Graphics();
    view.fillStyle(0xffffff, 1);
    view.roundedRect(0, 0, width, height, 2);
    view.fill();

    this.add(view)
    view.alignAnchor(0.5);
  }

  _initBody() {
    const width = this._width;
    const height = this._height;
    const s = PhysicsOption.worldScale;

    const body = this._body = this._physics.world.createDynamicBody(planck.Vec2(0, 0));
    body.createFixture(planck.Box(width * 0.5/s, height * 0.5/s), {
      friction: 20.5,
      restitution: 0.3,
      density: 0.1,
    });

    const mass = Math.random() * 0.4 + 0.3;
    body.setGravityScale(mass);
    body.view = this._view;
    body.setUserData(this._view);
    // body.setActive(false);
    const angle = Math.random()* 20;
    body.setAngle(angle);

    // fixture.setSensor(true);
  }
}