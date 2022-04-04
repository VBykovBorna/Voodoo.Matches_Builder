import {
    Acceleration,
    Black, Ease,
    Emitter,
    FloatScatter,
    InitialLife, InitialPosition,
    InitialScale, InitialTexture,
    InitialVelocity, Modifier,
    RotationOverLife, ScaleOverLife, VectorScatter
} from "black-engine";

class InitialAngularVelocity extends Modifier {
    constructor(...values) {
        super(true);

        this.scatter = FloatScatter.fromObject(...values);
    }

    update(emitter, particle, dt) {
        particle.av = this.scatter.getValue();
    }
}

class AngularVelocity extends Modifier {
    constructor(...values) {
        super(false);

    }

    update(emitter, particle, dt) {
        particle.r += particle.av;
        particle.av *= 0.981;
    }
}

class AccelerationAdvanced extends Modifier {
    constructor(...values) {
        super(false);

        this.scatter = VectorScatter.fromObject(...values);
    }

    update(emitter, particle, dt) {
        this.scatter.getValue();

        particle.ax += this.scatter.value.x;
        particle.ay += this.scatter.value.y;

        let f = 0.15;
        particle.ax *= f;
        particle.ay *= f;
    }
}

export default class Confetti extends Emitter
{
    constructor() {
        super();

        let textures = Black.assets.getTextures('textures/confetti/confetti_*');

        this.emitDelay = new FloatScatter(0.01);
        this.emitInterval = new FloatScatter(1);
        this.emitDuration = new FloatScatter(0.1);
        this.emitCount = new FloatScatter(150);
        this.emitNumRepeats = new FloatScatter(3);
        this.textures = textures;
        this.space = this;
        this.add(new InitialPosition(-Black.stage.width / 2, 0, Black.stage.width / 2, 0));
        this.add(new InitialTexture(0, 8));
        this.add(new InitialScale(0.3, 0.6));
        this.add(new InitialLife(2, 3));
        this.add(new InitialVelocity(-300, -200, 300, 500));
        this.add(new AccelerationAdvanced(0, 200, 0, 200, Ease.cubicOut));
        this.add(new InitialAngularVelocity(-0.5, 0.5));
        this.add(new AngularVelocity());
        this.add(new ScaleOverLife(0.5, 0));
        this.play();

        if (creativeWrapper.getParam('sounds') === true) {
            Black.audio.play('confetti');
            Black.audio.play('success');
        }
    }

    onAdded() {
        this._resize = Black.stage.on('resize', () => this._onResize());
        this._onResize();
    }

    onRemoved() {
        this._resize.off();
    }

    _onResize()
    {
        this.x = this.stage.centerX;
        this.y = this.stage.bounds.y - 100;
    }
}
