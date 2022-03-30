const { isNickname } = require('./validation');
const { isPassword } = require('./validation');
const { confirmPassword } = require('./validation');

test('닉네임은 최소 3자 이상, 알파벳 대소문자(a~z, A~Z), 숫자(0~9)로 이루어져 있어야 합니다.', () => {
    expect(isNickname("Test1")).toEqual(true); // 3글자이상, 알파벳대소문자,숫자로 이루어진 상황
    expect(isNickname("te")).toEqual(false); // 3글자 미만인 상황
    expect(isNickname("Test1%")).toEqual(false); // 특수문자가 들어가있는 상황
  });

test('비밀번호는 최소 4자 이상이며, 닉네임과 같은 값이 포함된 경우 회원가입에 실패합니다', () => {
    expect(isPassword("1234","Test1")).toEqual(true); // 비밀번호 4글자이상 
    expect(isPassword("123","Test1")).toEqual(false); // 비밀번호 4글자미만
    expect(isPassword("Test123","Test1")).toEqual(false); // 비밀번호에 닉네임과 같은 값이 포함된 경우
  });

  test('비밀번호 확인은 비밀번호와 정확하게 일치해야 합니다.', () => {
    expect(confirmPassword("1234","1234")).toEqual(true); // 비밀번호와 비밀번호확인이 같은경우
    expect(confirmPassword("1234","12345")).toEqual(false); // 비밀번호와 비밀번호확인이 다른경우    
  });  
  





