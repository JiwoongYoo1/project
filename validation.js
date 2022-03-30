module.exports = {
    isNickname: (value) => {
        const nickname = (value || '');
        if(nickname.length <3 ){
            return false
        }
        for (const word of nickname.toLowerCase().split("")) {
                if (!["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","0","1","2","3","4","5","6","7","8","9"].includes(word)) {
                  return false;
                }
              }        
        return true;   
    },
    isPassword: (value, value2)  => {
        const password = (value || '');  
        const nickname = (value2 || '');      
        if(password.length <4 ){
            return false
        }else if(password.includes(nickname)){                        
            return false
        }            
        return true;       
    },
    confirmPassword: (value, value2)  => {
        const password = (value || '');  
        const confirmPassword = (value2 || '');      
        if(password !== confirmPassword ){
            return false
        }           
        return true;       
    }
};

 