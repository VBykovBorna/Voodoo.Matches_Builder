import {MessageDispatcher} from "black-engine";

export class VisibilityHandler {

  constructor(devMode) {
    this.events = new MessageDispatcher();
    this._isBlurByTime = false;
    this._isFocused = true;
    this._isGamePaused = false;

    this._startTime = new Date();

    this._totalElapsedTmp = 0;
    this._isDevMode = devMode;

    this.init();
  }

  init() {
    this._handleVisibilityChange();
    this._checkFocusByTime();
    this._handleCanvasTouchEvents();
  }

  /**
   * Handle canvas touch start and move events to resume the game
   * This can helps when the game runs in iFrame and external dom element (like info button, etc..) takes the focus
   *
   * @private
   * @returns {void}
   */
  _handleCanvasTouchEvents() {
    const handleStart = () => this._onFocus();
    const handleEnd = () => this._onFocus();
    const handleMove = () => this._onFocus();

    const canvasElements = document.getElementsByTagName("canvas");
    for (let i = 0; i < canvasElements.length; i++) {
      const canvasElement = canvasElements[i];

      canvasElement.addEventListener("touchstart", handleStart, false);
      canvasElement.addEventListener("touchend", handleEnd, false);
      canvasElement.addEventListener("touchmove", handleMove, false);
    }
  }

  /**
   * Add new Worker to check blur event by difference between totalElapsedSeconds
   * This workaround is useful for Android 5-7 browser that don't fired blur and focus events and unsupported ChangeVisibility API
   *
   * @private
   * @returns {void}
   */
  _checkFocusByTime() {

    if (typeof (Worker) !== 'undefined' && !/MSIE 10/i.test(navigator.userAgent)) {
      try {
        const blobURL = URL.createObjectURL(new Blob(['(',
            function () {
              const intervalTime = 500;
              setInterval(() => {
                self.postMessage("setInterval");
              }, intervalTime);
            }.toString(),

            ')()'], {type: 'application/javascript'})),

          worker = new Worker(blobURL);

        worker.onmessage = (event) => {
          if (event.data === 'setInterval') {
            if (Math.abs(this._getElapsedTime() - this._totalElapsedTmp) < 0.1) {
              this._onBlur();
              this._isBlurByTime = true;
            } else {
              if (this._isBlurByTime) {
                this._onFocus();
                this._isBlurByTime = false;
              }
            }
            this._totalElapsedTmp = this._getElapsedTime();
          }
        };

        URL.revokeObjectURL(blobURL);
      } catch (error) {
        console.error(error);
      }
    }
  }

  _getElapsedTime() {
    let endTime = new Date();
    let timeDiff = endTime - this._startTime;

    return Math.round(timeDiff);
  }

  /**
   * Handle blur and focus events to pause the game when application is minimized or lose the focus
   *
   * @private
   * @returns {void}
   */
  _handleVisibilityChange() {
    let hidden = '';
    let visibilityChange = '';

    if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
      hidden = "hidden";
      visibilityChange = "visibilitychange";
    } else if (typeof document.msHidden !== "undefined") {
      hidden = "msHidden";
      visibilityChange = "msvisibilitychange";
    } else if (typeof document.webkitHidden !== "undefined") {
      hidden = "webkitHidden";
      visibilityChange = "webkitvisibilitychange";
    }

    document.addEventListener(visibilityChange, () => document[hidden] ? this._onBlur() : this._onFocus(), false);

    if(!this._isDevMode) {
      window.onblur = () => this._onBlur();
      window.onfocus = () => this._onFocus();
    }
  }

  /**
   *
   * @private
   * @returns {void}
   */
  _onBlur() {
    if (this._isFocused === false) {
      return;
    }

    this._isFocused = false;
    this._onPauseGame();
  }

  /**
   *
   * @private
   * @returns {void}
   */
  _onFocus() {
    if (this._isFocused)
      return;

    this._isFocused = true;
    this._isBlurByTime = false;
    this._onResumeGame();
  }

  /**
   *
   * @private
   * @returns {void}
   */
  _onPauseGame() {
    if (this._isGamePaused) {
      return;
    }

    this._isGamePaused = true;
    this.events.post('pause');
  }

  /**
   *
   * @private
   * @returns {void}
   */
  _onResumeGame() {
    if (this._isGamePaused === false) {
      return;
    }

    this._isGamePaused = false;
    this.events.post('resume');
  }
}
