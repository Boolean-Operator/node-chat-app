const expect = require('expect');

const {isRealString} =require('./validation.js');


describe('isRealString', () => {
  it('should reject non-string values', () => {
    let str = 123453;
    let res = isRealString(str);
      expect(res).toBe(false);
  });

  it('should reject string with only spaces', () => {
    let str = '    ';
    let res = isRealString(str);
      expect(res).toBe(false);
  });

  it('should allow sting with non-space characters', () => {
    let str = '  Actual String123453  ';
    let res = isRealString(str);
      expect(res).toBe(true);
  });
});
