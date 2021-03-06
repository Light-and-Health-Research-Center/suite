import { log } from "./math";

/*
args:
  backgroundLuminance (cd/m^2)

return:
  pupilRadius (mm)
*/
export function pupilRadius(backgroundLuminance) {
  return 2.3859 - 1.2204 * Math.tanh(0.3 * log(backgroundLuminance, 10));
}

/*
args:
  ageOfObserver (years)
  pupilRadius (mm)
  backgroundLuminance (cd/m^2)

return:
  retinalIlluminance (age-corrected, Td)
*/
export function retinalIlluminance(
  ageOfObserver,
  pupilRadius,
  backgroundLuminance
) {
  return (
    backgroundLuminance *
    Math.PI *
    Math.pow(pupilRadius, 2) *
    (1 - 0.017 * (ageOfObserver - 20))
  );
}

/*
args:
  ageOfObserver (years)
  targetSize (µsr)
  retinalIlluminance (age-corrected, Td)

return:
  thresholdContrast
*/
export function thresholdContrast(
  ageOfObserver,
  targetSize,
  retinalIlluminance
) {
  const targetSolidAngularSize = 0.000001 * targetSize;
  const p1 = log(Math.tanh(20000 * targetSolidAngularSize));
  const p2 = log(log((10 * retinalIlluminance) / Math.PI));
  const p3 = 1 + (0.113 / 45) * (ageOfObserver - 20);
  return (
    p3 *
    Math.pow(
      10,
      -1.36415 -
        0.178589 * p1 -
        0.81285 * p2 +
        0.225998 * p1 * p1 -
        0.077169 * p2 * p2 +
        0.169252 * p1 * p2
    )
  );
}

/*
args:
  targetSize (µsr)
  retinalIlluminance (age-corrected, Td)

return:
  halfSaturationConstant (K)
*/
export function halfSaturationConstant(targetSize, retinalIlluminance) {
  const targetSolidAngularSize = 0.000001 * targetSize;
  const p1 = log(Math.tanh(5000 * targetSolidAngularSize));
  const p2 = log(Math.tanh((0.04 * retinalIlluminance) / Math.PI));
  return Math.pow(
    10,
    -1.763006 -
      0.175369 * p1 -
      0.030967 * p2 +
      0.112027 * p1 * p1 +
      0.170583 * p2 * p2 +
      0.062194 * p1 * p2
  );
}

/*
args:
  retinalIlluminance (age-corrected, Td)

return:
  maximumResponse (Rmax)
*/
export function maximumResponse(retinalIlluminance) {
  return 0.000196 * log(retinalIlluminance) + 0.0027;
}

/*
args:
  luminanceContrast
  maximumResponse (Rmax)
  thresholdContrast
  halfSaturationConstant (K)

return:
  performance (R)
*/
export function performance(
  luminanceContrast,
  maximumResponse,
  thresholdContrast,
  halfSaturationConstant
) {
  return (
    maximumResponse *
    (Math.pow(luminanceContrast - thresholdContrast, 0.97) /
      (Math.pow(luminanceContrast - thresholdContrast, 0.97) +
        Math.pow(halfSaturationConstant, 0.97)))
  );
}

/*
args:
  performance (R)

return:
  reactionTime (ms)
*/
export function reactionTime(performance) {
  return 1 / performance;
}

/*
args:
  luminanceContrast
  thresholdContrast

return:
  visibilityLevel
*/
export function visibilityLevel(luminanceContrast, thresholdContrast) {
  return luminanceContrast / thresholdContrast;
}

/*
args:
  reactionTime (ms)

return:
  relativeVisualPerformance (RVP)
*/
export function relativeVisualPerformance(reactionTime) {
  return 1.419771 - reactionTime / 778.564411;
}

/*
args:
  ageOfObserver (years)
  luminanceContrast
  targetSize (µsr)
  backgroundLuminance (cd/m^2)

return:
  thresholdContrast
*/
export function fullCalculation(
  ageOfObserver,
  luminanceContrast,
  targetSize,
  backgroundLuminance
) {
  const _pupilRadius = pupilRadius(backgroundLuminance);
  const _retinalIlluminance = retinalIlluminance(
    ageOfObserver,
    _pupilRadius,
    backgroundLuminance
  );
  const _targetLuminanceContrast = luminanceContrast;
  const _targetSolidAngularSize = 0.000001 * targetSize;
  const _thresholdContrast = thresholdContrast(
    ageOfObserver,
    targetSize,
    _retinalIlluminance
  );
  const _halfSaturationConstant = halfSaturationConstant(
    targetSize,
    _retinalIlluminance
  );
  const _maximumResponse = maximumResponse(_retinalIlluminance);
  const _performance = performance(
    luminanceContrast,
    _maximumResponse,
    _thresholdContrast,
    _halfSaturationConstant
  );
  const _reactionTime = reactionTime(_performance);
  const _visibilityLevel = visibilityLevel(
    luminanceContrast,
    _thresholdContrast
  );
  const _relativeVisualPerformance = relativeVisualPerformance(_reactionTime);

  return {
    pupilRadius: _pupilRadius,
    retinalIlluminance: _retinalIlluminance,
    targetLuminanceContrast: _targetLuminanceContrast,
    targetSolidAngularSize: _targetSolidAngularSize,
    thresholdContrast: _thresholdContrast,
    halfSaturationConstant: _halfSaturationConstant,
    maximumResponse: _maximumResponse,
    performance: _performance,
    reactionTime: _reactionTime,
    visibilityLevel: _visibilityLevel,
    relativeVisualPerformance: _relativeVisualPerformance,
  };
}
