const expect = require('expect');
const { isRealString } = require('./validation');

describe('isRealString', () => {

  it('should reject non string values', () => {
    expect(isRealString(12)).toBe(false);
    expect(isRealString({ foo: 'bar'})).toBe(false);
  });

  it('should reject string with spaces only', () => {
    expect(isRealString('   ')).toBe(false);
  });

  it('should allow string with non-space characters', () => {
    expect(isRealString('str')).toBe(true);
  });

});
