import { Component } from 'black-engine';

/**
 * @author Comics
 */
export default class MaxWidthComponent extends Component {
  constructor(maxWidth, maxFonSize = 32, doAlign = true) {
    super();

    this._maxWidth = maxWidth;
    this._maxFontSize = maxFonSize;
    this._doAlign = doAlign;
  }

  onAdded(gameObject) {
    gameObject.on('change', this.onChange, this);
    this.onChange();
  }

  onChange() {
    if (!this.gameObject.autoSize)
      return;
    if (this.gameObject.width > this._maxWidth) {
      while (this.gameObject.width > this._maxWidth) {
        this._changeSize(this.gameObject.size - 1);
        if (this.gameObject.size <= 0)
          break;
      }
      if (this._doAlign)
        this.gameObject.alignPivotOffset();
    } else if (this.gameObject.size < this._maxFontSize) {
      this._changeSize(this._maxFontSize);
      this.onChange();
    }
  }

  _changeSize(value) {
    this.gameObject.getAllStyles().forEach(x => {
      x.size = value;
    });
    this.gameObject.size = value;
  }

  get maxWidth() {
    return this._maxWidth;
  }

  set maxWidth(value) {
    this._maxWidth = value;
    this.onChange();
  }

  get maxFonSize() {
    return this._maxFontSize;
  }

  set maxFonSize(value) {
    this._maxFontSize = value;
    this.onChange();
  }
}
