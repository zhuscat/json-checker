var __ = -1;

var SPACE = 0, // space
    WHITE = 1, // other white space
    LCURB = 2, // {
    RCURB = 3, // }
    LSQRB = 4, // [
    RSQRB = 5, // ]
    COLON = 6, // :
    COMMA = 7, // ,
    QUOTE = 8, // "
    BACKS = 9, // \
    SLASH = 10, // /
    PLUS = 11, // +
    MINUS = 12, // -
    POINT = 13, // .
    ZERO = 14, // 0
    DIGIT = 15, // 123456789
    LOW_A = 16, // a
    LOW_B = 17, // b
    LOW_C = 18, // c
    LOW_D = 19, // d
    LOW_E = 20, // e
    LOW_F = 21, // f
    LOW_L = 22, // l
    LOW_N = 23, // n
    LOW_R = 24, // r
    LOW_S = 25, // s
    LOW_T = 26, // t
    LOW_U = 27, // u
    ABCDF = 28, // ABCDF
    E = 29, // E
    ETC = 30; // others

var ascii_class = [
  __, __, __, __, __, __, __, __,
  __, WHITE, WHITE, __, __, WHITE, __, __,
  __, __, __, __, __, __, __, __,
  __, __, __, __, __, __, __, __,
  SPACE, ETC, QUOTE, ETC, ETC, ETC, ETC, ETC,
  ETC, ETC, ETC, PLUS, COMMA, MINUS, POINT, SLASH,
  ZERO, DIGIT, DIGIT, DIGIT, DIGIT, DIGIT, DIGIT, DIGIT,
  DIGIT, DIGIT, COLON, ETC, ETC, ETC, ETC, ETC,
  ETC, ABCDF, ABCDF, ABCDF, ABCDF, E, ABCDF, ETC,
  ETC, ETC, ETC, ETC, ETC, ETC, ETC, ETC,
  ETC, ETC, ETC, ETC, ETC, ETC, ETC, ETC,
  ETC, ETC, ETC, LSQRB, BACKS, RSQRB, ETC, ETC,
  ETC, LOW_A, LOW_B, LOW_C, LOW_D, LOW_E, LOW_F, ETC,
  ETC, ETC, ETC, ETC, LOW_L, ETC, LOW_N, ETC,
  ETC, ETC, LOW_R, LOW_S, LOW_T, LOW_U, ETC, ETC,
  ETC, ETC, ETC, LCURB, ETC, RCURB, ETC, ETC
];

var state_reverse_map = [
  'GO', 'OK', 'OB', 'KE', 'CO', 'VA', 'AR', 'ST', 'ES', 'U1', 'U2', 'U3', 'U4', 'MI', 'ZE', 'IN', 'FR', 'E1', 'E2', 'E3',
  'T1', 'T2', 'T3', 'F1', 'F2', 'F3', 'F4', 'N1', 'N2', 'N3'
];

var GO = 0, // start
    OK = 1, // ok
    OB = 2, // object
    KE = 3, // key
    CO = 4, // colon
    VA = 5, // value
    AR = 6, // arrry
    ST = 7, // string
    ES = 8, // escape
    U1 = 9, // unicode first
    U2 = 10, // unicode second
    U3 = 11, // unicode third
    U4 = 12, // unicode fourth
    MI = 13, // minus
    ZE = 14, // zero
    IN = 15, // integer
    FR = 16, // fraction
    E1 = 17, // e
    E2 = 18, // ex
    E3 = 19, // exp
    T1 = 20, // tr
    T2 = 21, // tru
    T3 = 22, // true
    F1 = 23, // fa
    F2 = 24, // fal
    F3 = 25, // fals
    F4 = 26, // false
    N1 = 27, // nu
    N2 = 28, // nul
    N3 = 29; // null

var state_transition_table = [
/*
               s   w   {   }   [   ]   :   ,   "   \   /   +   -   .   0   d   a   b  c   d    e   f   l   n   r   s   t   u   AF  E  etc*/
/* start  */  [GO, GO, -6, __, -5, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __],
/* ok     */  [OK, OK, __, -8, __, -7, __, -3, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __],
/* object */  [OB, OB, __, -9, __, __, __, __, ST, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __],
/* key    */  [KE, KE, __, __, __, __, __, __, ST, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __],
/* colon  */  [CO, CO, __, __, __, __, -2, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __],
/* value  */  [VA, VA, -6, __, -5, __, __, __, ST, __, __, __, MI, __, ZE, IN, __, __, __, __, __, F1, __, N1, __, __, T1, __, __, __, __],
/* array  */  [AR, AR, -6, __, -5, -7, __, __, ST, __, __, __, MI, __, ZE, IN, __, __, __, __, __, F1, __, N1, __, __, T1, __, __, __, __],
/* string */  [ST, __, ST, ST, ST, ST, ST, ST, -4, ES, ST, ST, ST, ST, ST, ST, ST, ST, ST, ST, ST, ST, ST, ST, ST, ST, ST, ST, ST, ST, ST],
/* escape */  [__, __, __, __, __, __, __, __, ST, ST, ST, __, __, __, __, __, __, __, __, __, __, ST, __, ST, ST, __, ST, U1, __, __, __],
/* u1     */  [__, __, __, __, __, __, __, __, __, __, __, __, __, __, U2, U2, U2, U2, U2, U2, U2, U2, __, __, __, __, __, __, U2, U2, __],
/* u2     */  [__, __, __, __, __, __, __, __, __, __, __, __, __, __, U3, U3, U3, U3, U3, U3, U3, U3, __, __, __, __, __, __, U3, U3, __],
/* u3     */  [__, __, __, __, __, __, __, __, __, __, __, __, __, __, U4, U4, U4, U4, U4, U4, U4, U4, __, __, __, __, __, __, U4, U4, __],
/* u4     */  [__, __, __, __, __, __, __, __, __, __, __, __, __, __, ST, ST, ST, ST, ST, ST, ST, ST, __, __, __, __, __, __, ST, ST, __],
/* minus  */  [__, __, __, __, __, __, __, __, __, __, __, __, __, __, ZE, IN, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __],
/* zero   */  [OK, OK, __, -8, __, -7, __, -3, __, __, __, __, __, FR, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __],
/* int    */  [OK, OK, __, -8, __, -7, __, -3, __, __, __, __, __, FR, IN, IN, __, __, __, __, E1, __, __, __, __, __, __, __, __, E1, __],
/* frac   */  [OK, OK, __, -8, __, -7, __, -3, __, __, __, __, __, __, FR, FR, __, __, __, __, E1, __, __, __, __, __, __, __, __, E1, __],
/* e      */  [__, __, __, __, __, __, __, __, __, __, __, E2, E2, __, E3, E3, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __],
/* ex     */  [__, __, __, __, __, __, __, __, __, __, __, __, __, __, E3, E3, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __],
/* exp    */  [OK, OK, __, -8, __, -7, __, -3, __, __, __, __, __, __, E3, E3, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __],
/* tr     */  [__, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, T2, __, __, __, __, __, __],
/* tru    */  [__, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, T3, __, __, __],
/* true   */  [__, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, OK, __, __, __, __, __, __, __, __, __, __],
/* fa     */  [__, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, F2, __, __, __, __, __, __, __, __, __, __, __, __, __, __],
/* fal    */  [__, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, F3, __, __, __, __, __, __, __, __],
/* fals   */  [__, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, F4, __, __, __, __, __],
/* false  */  [__, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, OK, __, __, __, __, __, __, __, __, __, __],
/* nu     */  [__, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, N2, __, __, __],
/* nul    */  [__, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, N3, __, __, __, __, __, __, __, __],
/* null   */  [__, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, __, OK, __, __, __, __, __, __, __, __],
];

var mode_reverse_map = [
  'MODE_ARRAY', 'MODE_DONE', 'MODE_KEY', 'MODE_OBJECT'
];

var MODE_ARRAY = 0,
    MODE_DONE = 1,
    MODE_KEY = 2,
    MODE_OBJECT = 3;

function JsonChecker() {
  this.state = GO;
  this.stack = [];
  this.push(MODE_DONE);
}

JsonChecker.prototype.push = function push(mode) {
  this.stack.push(mode);
  return true;
}

JsonChecker.prototype.pop = function pop(mode) {
  if (this.stack.length === 0 || this.stack[this.stack.length - 1] !== mode) {
    return false;
  }
  this.stack.pop();
  return true;
}

JsonChecker.prototype.checkNext = function checkNext(nextChar) {
  var nextClass, nextState;
  if (nextChar < 0) {
    return this.reject();
  }
  if (nextChar >= 128) {
    nextClass = ETC;
  } else {
    nextClass = ascii_class[nextChar];
    if (nextClass <= __) {
      return this.reject();
    }
  }

  nextState = state_transition_table[this.state][nextClass];
  if (nextState >= 0) {
    this.state = nextState;
  } else {
    switch (nextState) {
      case -9:
        if (!this.pop(MODE_KEY)) {
          return this.reject();
        }
        this.state = OK;
        break;
      case -8:
        if (!this.pop(MODE_OBJECT)) {
          return this.reject();
        }
        this.state = OK;
        break;
      case -7:
        if (!this.pop(MODE_ARRAY)) {
          return this.reject();
        }
        this.state = OK;
        break;
      case -6:
        if (!this.push(MODE_KEY)) {
          return this.reject();
        }
        this.state = OB;
        break;
      case -5:
        if (!this.push(MODE_ARRAY)) {
          return this.reject();
        }
        this.state = AR;
        break;
      case -4:
        switch (this.stack[this.stack.length - 1]) {
          case MODE_KEY:
            this.state = CO;
            break;
          case MODE_ARRAY:
          case MODE_OBJECT:
            this.state = OK;
            break;
          default:
            return this.reject();
        }
        break;
      case -3:
        switch (this.stack[this.stack.length - 1]) {
          case MODE_OBJECT:
            if (!this.pop(MODE_OBJECT) || !this.push(MODE_KEY)) {
              return this.reject();
            }
            this.state = KE;
            break;
          case MODE_ARRAY:
            this.state = VA;
            break;
          default:
            return this.reject();
        }
        break;
      case -2:
        if (!this.pop(MODE_KEY) || !this.push(MODE_OBJECT)) {
          return this.reject();
        }
        this.state = VA;
        break;
      default:
        return this.reject();
    }
  }
  return true;
}

JsonChecker.prototype.reject = function reject() {
  return false;
}

JsonChecker.prototype.done = function done() {
  return this.state === OK && this.pop(MODE_DONE);
}

JsonChecker.prototype.check = function check(str) {
  var i, result, flag = true;
  for (i = 0; i < str.length; i++) {
    result = this.checkNext(str.charCodeAt(i));
    if (!result) {
      console.log(`出现错误，第${i}个字符，出错字符为${str.charAt(i)}`);
      flag = false;
      break;
    }
  }
  if (flag) {
    result = this.done();
    if (result) {
      console.log('合法JSON字符串');
      return true;
    }
    return false;
  }
  return false;
}