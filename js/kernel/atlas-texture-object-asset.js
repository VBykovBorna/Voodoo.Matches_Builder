import { Asset, AssetType, Texture, LoaderType, AtlasTexture } from 'black-engine';

export default class AtlasTextureObjAsset extends Asset {
  /**
   * Creates new AtlasTextureAsset instance.
   *
   * @param {string} name     Name of the asset.
   * @param {string} imageUrl Image URL.
   * @param {object} jsonObj  Json Object.
   */
  constructor(name, imageUrl, jsonObjOrUrl) {
    super(AssetType.TEXTURE_ATLAS, name);

    /**
     * @private
     * @type {string}
     */
    this.mImageUrl = imageUrl;

    this.jsonObjOrUrl = jsonObjOrUrl;

    /**
     * @private
     * @type {number}
     */
    this.mScale = 1 / Texture.getScaleFactorFromName(imageUrl);

    /**
     * @private
     * @type {black-engine~ImageAssetLoader|null}
     */
    this.mImageLoader = null;
  }

  /**
   * @inheritDoc
   */
  onLoaderRequested(factory) {
    this.mImageLoader = factory.get(LoaderType.IMAGE, this.mImageUrl);
    this.addLoader(this.mImageLoader);

    if (typeof this.jsonObjOrUrl === 'string' || this.jsonObjOrUrl instanceof String) {
      this.mXHR = factory.get(LoaderType.XHR, this.jsonObjOrUrl);
      this.mXHR.mimeType = 'application/json';
      this.mXHR.responseType = 'json';
      this.addLoader(this.mXHR);
    }
  }

  /**
   * @inheritDoc
   */
  onAllLoaded() {
    if (typeof this.jsonObjOrUrl === 'string' || this.jsonObjOrUrl instanceof String)
      super.ready(new AtlasTexture(this.mImageLoader.data, this.mXHR.data, this.mScale));
    else
      super.ready(new AtlasTexture(this.mImageLoader.data, this.mJsonObj, this.mScale));
  }
}

