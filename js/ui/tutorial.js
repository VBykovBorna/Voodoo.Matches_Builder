import {
  Black,
  DisplayObject, FontAlign,
  FontStyle,
  FontWeight,
  Sprite,
  TextField,
  Timer,
  Tween,
  Ease
} from "black-engine";
import localization from "js/localization";

export default class Tutorial extends DisplayObject {
  constructor() {
    super();

    this._resize = null;

    this._init();
  }

  onAdded() {
    super.onAdded();

    this._resize = Black.stage.on('resize', () => this._onResize());
    this._onResize();

    this.__initTween();
    this._tween.play();
  }

  onRemoved() {
    this._resize.off();
  }

  __initTween() {
    this._hand.removeAllComponents();

    let t1 = new Tween({scaleX: 1.2, scaleY: 1.2}, 1, {delay: 0.2, playOnAdded: true, ease: Ease.sinusoidalInOut });
    t1.loop = true;
    t1.yoyo = true;

    this._hand.addComponent(t1);

    this._tween = t1;
  }

  _init() {
    this._hand = new Sprite('textures/icon_hand');
    this._hand.pivotOffsetX = 13;
    this._hand.pivotOffsetY = 0;

    this.addChild(this._hand);

    this._txt = new TextField(localization.get('TUTORIAL_TEXT'), 'Baloo', 0xffffff, 56, FontStyle.NORMAL, FontWeight.NORMAL, 8, 0x000000);
    this._txt.align = FontAlign.CENTER;
    this._txt.multiline = true;
    this._txt.lineHeight = 0.95;
    this._txt.alignPivotOffset();

    this.addChild(this._txt);

    this._tween = null;

    /** @type {Timer} */
    this._timer = new Timer(1, creativeWrapper.getParam('hintDelay'));
    this._timer.on('complete', () => this._onRestart());
    this._timer.startOnAdded = false;
    this.addComponent(this._timer);
  }

  _onResize() {
    this._hand.x = this.stage.centerX - 30;
    this._hand.y = this.stage.centerY;

    this._txt.x = this.stage.centerX;
    this._txt.y = this.stage.bounds.height + this.stage.bounds.y - 180;
  }

  _onRestart() {
    this._onResize();
    this.__initTween();
    this._tween.play();
    this.visible = true;
  }

  onTap() {
    this.visible = false;
    this._resetTimer();
  }

  _resetTimer() {
    this._timer.reset();

    if (this._timer.isRunning === false)
      this._timer.start();
  }

  setEnabled(value) {
    this.visible = value;
    if (!value)
      this._timer.pause();
    else
      this._timer.start();
  }
}
