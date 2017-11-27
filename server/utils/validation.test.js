var expect = require('expect');
//ES6 Desctructuring
var {isRealString} = require('./validation');

//describe block isRealString
describe('isRealString', () => {
  it('should reject non-string (number) values', () => {
    expect(isRealString(345)).toBeFalsy();
  });

  it('should reject non-string (boolean) values', () => {
    expect(isRealString(true)).toBeFalsy();
  });

  it('should reject strings with only spaces', () => {
    expect(isRealString('   ')).toBeFalsy();
  });

  it('should allow strings with non-space characters', () => {
    expect(isRealString('  hello World ')).toBeTruthy();
  });

});
