import { AssetManager, GameObject, Black, Asset, AssetType, Texture, LoaderType, AtlasTexture } from 'black-engine';
import AtlasTextureObjAsset from 'js/kernel/atlas-texture-object-asset';
import localization from 'js/localization';
import { stringsDataStr } from './data/stringsData';
import Game from 'js/states/game';
import { CreativeWrapper } from "./libs/wrapper/creative-wrapper";

// Models
import character from 'assets/models/character.glb';
import platform from 'assets/models/TilePlatform.glb';

//Model animations
import anim_idle from 'assets/models/anim Nervously Look Around.glb';

//Model textures
import skin_thief from 'assets/textures/skin_thief.png';
import map_orange from 'assets/textures/map_orange.png';
import water from 'assets/textures/water.png';

//jpg single images
import cta_bg from 'assets/cta/bg.jpg';

//Black atlas
import atlas from './../assets/atlas.png';
import atlasData from '../assets/atlas.json';
import matches_assets from './../assets/assets.png';
import matches_assets_data from '../assets/assets.json';

//Sounds
import sound_throw from 'assets/sounds/throw_01.mp3';
import sound_bg_music from 'assets/sounds/bg_music.mp3';
import sound_success from 'assets/sounds/success.mp3';
import sound_confetti from 'assets/sounds/confetti.mp3';

//Fonts
import fontBaloo from 'assets/fonts/Baloo-Regular.woff';


export class Loader extends GameObject {
  constructor() {
    super();

    Loader.Assets = {};

    let assets = new AssetManager();
    this._addAssetLoader(assets);
    this._assetsLoaded = false;

    //Black/UI
    assets.enqueueImage('cta_bg', cta_bg);
    assets.enqueueAtlasObj('assets', atlas, atlasData);
    assets.enqueueAtlasObj('matches_assets', matches_assets, matches_assets_data);

    //sounds
    assets.enqueueSound('bg_music', sound_bg_music);
    assets.enqueueSound('confetti', sound_confetti);
    assets.enqueueSound('success', sound_success);
    assets.enqueueSound('throw', sound_throw);

    // fonts
    assets.enqueueFont('Baloo', fontBaloo);

    assets.on('progress', this.onAssetsProgress, this);
    assets.on('complete', this.onAssetsLoadded, this);
    assets.loadQueue();
  }

  _addAssetLoader(assetManager) {
    assetManager.enqueueAtlasObj = function (name, imageUrl, jsonData) {
      this.enqueueAsset(name, this.__getAsset('atlas_json_obj', name, this.mDefaultPath + imageUrl, jsonData));
    };

    assetManager.setAssetType('atlas_json_obj', AtlasTextureObjAsset);
  }

  onAssetsProgress(msg, p) {
  }

  onAssetsLoadded(m) {
    this.loadGame();
  }

  loadGame() {
    this._assetsLoaded = true;
    creativeWrapper.hideSplashScreen();

    localization.registerStrings(JSON.parse(stringsDataStr));
  }

  onUpdate() {
    if (window.creativeWrapper.state !== CreativeWrapper.STATE.none && this._assetsLoaded) {
      window.creativeWrapper.state = CreativeWrapper.STATE.live;
      this.removeFromParent();

      let game = new Game();
      game.init();
    }
  }
}

Loader.Assets = {};
