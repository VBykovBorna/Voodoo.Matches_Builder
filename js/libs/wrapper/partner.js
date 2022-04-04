import {MessageDispatcher} from "black-engine";
import {CreativeWrapper} from "./creative-wrapper";

export class Partner {
  constructor(creativeConfig) {
    this.config = creativeConfig;

    this.state = CreativeWrapper.STATE.none;
    this.storeURL = {
      'android': this.config.googlePlayStoreUrl,
      'iOs': this.config.appStoreUrl,
    };

   this.events = new MessageDispatcher();

    this._splashScreenElement = null;
    this._ctaIdleTimer = null;
  }

  init() {
    this._initEvents();
    this.__initPartner();
  }

  start() {
    if (this.state === CreativeWrapper.STATE.none) {

      this.state = CreativeWrapper.STATE.ready;

      window.gameReady && window.gameReady();

      this._showSplashScreen();
      CreativeWrapper.START_CREATIVE();
      this.state = CreativeWrapper.STATE.started;

      this.__resetCTAIdleTime();
    }
  }

  getParam(paramKey){
    return this.config[paramKey.toString()].value;
  }

  getParams(){
    return this.config;
  }

  __initPartner() {
    this.state = CreativeWrapper.STATE.ready;

    window.gameReady && window.gameReady();

    window.addEventListener('load', function () {
      if (window.gameStart) {
        gameStart();
      }
    });

    this._showSplashScreen();
    CreativeWrapper.START_CREATIVE();
    //this.state = CreativeWrapper.STATE.started;

  }

  _initEvents() {
    this.events.on('onInteraction', this._onInteraction, this);
    this.events.on('onEndGame', this.__onEndGame, this);
    this.events.on('onInstall', this.__onInstall, this);
    this.events.on('onHideSplashScreen', this.__onHideSplashScreen, this);
  }

  __onEndGame() {
  }

  __onInstall() {
    window.location.href = this.__getStoreUrl();
  }

  __getStoreUrl() {
    return this._getMobileOS() === Partner.MOBILE_OS_TYPE.Android ? this.storeURL.android : this.storeURL.iOs;
  }

  __initMraidCustomEvents() {
  }

  _onInteraction() {
    this.__resetCTAIdleTime();
  }

  __onHideSplashScreen() {
    if (this._splashScreenElement) {
      this._splashScreenElement.style.display = 'none';
    }
  }

  _showSplashScreen() {
    this._splashScreenElement = document.getElementById('splash-screen');
    if (this._splashScreenElement)
      this._splashScreenElement.style.display = 'block';
  }

  _initMraidEvents() {
    mraid.addEventListener('viewableChange', () => {
      this.events.post(Partner.EVENT_TYPES.SHOW_CTA, mraid.isViewable());
    });

    if (!mraid.isViewable()) {
      let listener = () => {
        if (mraid.isViewable()) {
          mraid.removeEventListener('viewableChange', listener);
          this._start();
        }
      };

      mraid.addEventListener('viewableChange', listener);
    }

    mraid.addEventListener('audioVolumeChange', (volumePercent) => {
      //TODO this.gameAudio.volume = volumePercent, mute/unmute
      this.events.post(Partner.EVENT_TYPES.VOLUME_CHANGE, volumePercent);
      this.events.post(Partner.EVENT_TYPES.MUTE, volumePercent < 1);
    });

    mraid.addEventListener('error', (message, action) => {
      console.log('Mraid error.\n Message: ' + message + '\nAction: ' + action);
    });

    this.__initMraidCustomEvents();
  }

  /**
   * Determine the mobile operating system.
   * This function returns one of 'iOS', 'Android', 'Windows Phone', or 'unknown'.
   *
   * @returns {String}
   */
  _getMobileOS() {
    let userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
      return Partner.MOBILE_OS_TYPE.WindowsPhone;
    }

    if (/android/i.test(userAgent)) {
      return Partner.MOBILE_OS_TYPE.Android;
    }

    // iOS detection
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return Partner.MOBILE_OS_TYPE.iOS;
    }

    return Partner.MOBILE_OS_TYPE.Other;
  }

  __resetCTAIdleTime() {
    if (this._ctaIdleTimer) {
      clearTimeout(this._ctaIdleTimer);
    }

    this._ctaIdleTimer = setTimeout(() => {
      this._showCTA();
    }, this.config.secToCTA.value * 1000);
  }

  _showCTA() {
    this.events.post(Partner.EVENT_TYPES.SHOW_CTA);
  }
}

Partner.EVENT_TYPES = {
  'SHOW_CTA': 'showCTA',
  'PAUSE': 'pause',
  'RESUME': 'resume',
  'RESTART': 'restart',
  'VOLUME_CHANGE': 'audioVolumeChange',
  'MUTE': 'mute',
};

Partner.MOBILE_OS_TYPE = {
  Android: 0,
  iOS: 1,
  WindowsPhone: 2,
  Other: 3
};

