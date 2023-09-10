export function setSessionJwtToken(token){
    sessionStorage.setItem("jwtToken", token)
}

export function getSessionJwtToken(){
    return sessionStorage.getItem("jwtToken")
}

export function setSessionRefreshToken(token){
    sessionStorage.setItem("sessionRefreshToken", token)
}

export function getSessionRefreshToken(){
    return sessionStorage.getItem("sessionRefreshToken")
}