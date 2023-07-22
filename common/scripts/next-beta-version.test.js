const nextBetaVersion = require('./next-beta-version');

test("If we have a stable release and then we have a beta release with an API change (minor change)", () => {
  expect(nextBetaVersion('0.0.0', true)).toBe('0.1.0-beta.1');
});

test("If we have a stable release and then we have a beta release with no API change (patch change)", () => {
  expect(nextBetaVersion('0.0.0', false)).toBe('0.0.1-beta.1');
});

test("If we have a patch beta release and then we have a patch beta release", () => {
  expect(nextBetaVersion('0.0.1-beta.1', false)).toBe('0.0.2-beta.2');
});

test("If we have a 2nd consecutive patch beta release and then we have a patch beta release", () => {
  expect(nextBetaVersion('0.0.2-beta.2', false)).toBe('0.0.3-beta.3');
});

test("If we have a 2nd consecutive patch beta release and then we have a minor beta release", () => {
  expect(nextBetaVersion('0.0.2-beta.2', true)).toBe('0.1.0-beta.3');
});

test("If we have a minor beta release and then we have a minor beta release", () => {
  expect(nextBetaVersion('0.1.0-beta.1', true)).toBe('0.2.0-beta.2');
});

test("If we have a 2nd consecutive minor beta release and then we have a patch beta release", () => {
  expect(nextBetaVersion('0.2.0-beta.2', false)).toBe('0.2.1-beta.3');
});

test("If we have a 2nd consecutive minor beta release and then we have a minor beta release)", () => {
  expect(nextBetaVersion('0.2.0-beta.2', true)).toBe('0.3.0-beta.3');
});

test("If we have a patch beta release and then we have a minor beta release", () => {
  expect(nextBetaVersion('0.0.1-beta.1', true)).toBe('0.1.0-beta.2');
});

test("If we have a minor beta release and then we have a patch beta release", () => {
  expect(nextBetaVersion('0.1.0-beta.1', false)).toBe('0.1.1-beta.2');
});

test("If we have beta version 1.6.1-beta.0 and then we have minor beta release", () => {
  expect(nextBetaVersion('1.6.1-beta.0', true)).toBe('1.7.0-beta.1');
});