const inlineStorages = [
  'ad_inlined_images',
  'inlined3DObjects',
];

class InlineLoader {
  base64ToArrayBuffer(base64) {
    base64 = base64.split(',').pop(); //remove any headers.

    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  encodeBase64(base64) {
    return JSON.parse(atob(base64.split(',').pop()));
  }

  isAssetInlined(assetPath) {
    if (typeof assetPath !== 'string')
      return false;

    const pathArray = assetPath.split('/');
    const assetKey = pathArray[pathArray.length - 1];

    for (let i = 0; i < inlineStorages.length; i++) {
      if (window[inlineStorages[i]] && window[inlineStorages[i]][assetKey] !== undefined) {
        return true;
      }
    }

    return false;
  }

  getInline(assetPath) {
    if (this.isAssetInlined(assetPath) === false) {
      return this.convertUrl(assetPath);
    }

    const pathArray = assetPath.split('/');
    const assetKey = pathArray[pathArray.length - 1];

    for (let i = 0; i < inlineStorages.length; i++) {
      if (window[inlineStorages[i]] && window[inlineStorages[i]][assetKey] !== undefined) {
        return window[inlineStorages[i]][assetKey];
      }
    }
  }

  convertUrl(url) {
    return url;
    //return ImageLoader.prototype.convertPath(url);
  }
}

export default new InlineLoader();