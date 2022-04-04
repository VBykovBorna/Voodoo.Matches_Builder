  export const config = {
    showFPSMeter: false,
    orientationBlocker: false,
    creativeElementName: 'creative',
    antialias: true,
    cameraFov: 60,
    cameraNear: 0.01,
    cameraFar: 1000,
    renderResolution: 1,

    ambientLightEnabled: true,
    ambientLightColor: 0xFFEFE4,
    ambientLightIntensity: 0.55,

    directionalLightEnabled: true,
    directionalLightColor: 0xffffff,
    directionalLightIntensity: 0.5,
    directionalLightPosition: { x: -5, y: 50, z: -60 },
    directionalLightLookAt: { x: 0, y: 0, z: 50 },

    tapeDepth: 8,
    tapeMinPullLength: 1.5,
    tapeMaxPullLength: 4,
      // get rid of them, get values from tape data
    tapePossibleLengths: [2, 3, 4],
    tapeNumAngles: 18
  };