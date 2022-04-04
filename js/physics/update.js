import { MessageDispatcher } from "black-engine";
// import ObjectsType from "../game-objects/objects.type";
import PhysicsOption from "./physics-options";

class Update {
  constructor(world, pl) {
    this.events = new MessageDispatcher();
    this.world = world;
    this.pl = pl;
  }

  update() {
    if (PhysicsOption.PAUSED === true) {
      return;
    }

    const world = this.world;
    world.step(1 / 60);
    world.clearForces();

    for (let b = world.getBodyList(); b; b = b.getNext()) {
      if (b.getUserData()) {
        this.updateTransform(b);
      }
    }
  }

   updateTransform(b) {
    const worldScale = PhysicsOption.worldScale;
    const bodyPosition = b.getPosition();
    const bodyAngle = b.getAngle();
    const obj = b.getUserData();


    obj.x = bodyPosition.x * worldScale;
    obj.y = bodyPosition.y * worldScale;
    obj.rotation = bodyAngle;

    // switch (b.type) {
    //   case ObjectsType.fan:
    //     this.handleLaser(b);
    //     break;

    // }
  }

  // handleLaser(b) {
  //   const { world, pl } = this;
  //   const pos = b.getPosition();
  //   const p1 = pl.Vec2(pos.x, pos.y);
  //   const p2 = pl.Vec2(pos.x + b.data.x, pos.y + b.data.y);

  //   RayCastClosest.reset();
  //   world.rayCast(p1, p2, RayCastClosest.callback);
  //   const rP = RayCastClosest.point;

  //   if (b.isEnabled === false) {
  //     const other = RayCastClosest.body;

  //     if (other) {
  //       if (other.type === ObjectsType.balloon || other.type === ObjectsType.balloonGroup) {
  //         other.setLinearVelocity(pl.Vec2(0, 0));
  //       }
  //     }

  //     return;
  //   }

  //   if (RayCastClosest.hit) {
  //     if (rP.x === rayCastPoint.x && rP.y === rayCastPoint.y) {
  //       return;
  //     }

  //     b.data.isMax = false;
  //     let indexSpeed = 1;

  //     const other = RayCastClosest.body;

  //     if (other.getPosition().x < rP.x) {
  //       indexSpeed = -1;
  //     } else {
  //       indexSpeed = 1;
  //     }

  //     if (other) {
  //       if (other.type === ObjectsType.balloon || other.type === ObjectsType.balloonGroup) {
  //         this.balloonHit = other;
  //         other.setLinearVelocity(pl.Vec2(5 * indexSpeed, 0));
  //       } else if (other.type === ObjectsType.bubble) {
  //         const velocityY = -1

  //         other.setLinearVelocity(pl.Vec2(5 * indexSpeed, velocityY));
  //       } else {
  //         if (this.balloonHit) {
  //           this.balloonHit.setLinearVelocity(pl.Vec2(0, 0));
  //         }
  //       }
  //     }

  //     const d = Phaser.Math.Distance.BetweenPoints(p1, rP);
  //     const xD = Math.cos(b.data.angle) * d;
  //     const yD = Math.sin(b.data.angle) * d * -1;

  //     b.destroyFixture(b.getFixtureList());
  //     b.createFixture(pl.Chain([{ x: 0.1, y: 0.1 }, { x: xD + 0.1, y: yD + 0.1 }]), {
  //       density: 0.01,
  //       isSensor: true
  //     });

  //     if (rP) {
  //       rayCastPoint = rP;
  //     }
  //   } else {
  //     if (b.data.isMax) {
  //       return;
  //     }

  //     // const d: number = Phaser.Math.Distance.BetweenPoints(p1, p2);

  //     b.data.x = Math.cos(b.data.angle) * 40;
  //     b.data.y = Math.sin(b.data.angle) * 40 * -1;
  //     b.data.isMax = true;

  //     b.destroyFixture(b.getFixtureList());
  //     b.createFixture(pl.Chain([{ x: 0.1, y: 0.1 }, { x: b.data.x + 0.1, y: b.data.y + 0.1 }]), {
  //       density: 0.01,
  //       isSensor: true
  //     });

  //     if (rP) {
  //       rayCastPoint = rP;
  //     }
  //   }
  // }
}

const RayCastClosest = (() => {
  const def = {};

  def.reset = () => {
    def.hit = false;
    def.point = null;
    def.normal = null;
  };

  def.callback = (fixture, point, normal, fraction) => {
    const body = fixture.getBody();
    const userData = body.getUserData();

    if (userData) {
      if (userData === 0) {
        return -1.0;
      }
    }

    def.hit = true;
    def.point = point;
    def.normal = normal;
    def.body = body;

    return fraction;
  };

  return def;
})();

export default Update;
