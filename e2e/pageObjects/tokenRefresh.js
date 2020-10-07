import * as jwt from 'jsonwebtoken'


export const newTokens = {
    accessToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxOTE1NDUzNDkzLCJqdGkiOiIwYjVkYjlmN2ZiNjg0YWRlOGJiOWYzYmUyODc0YzM2MCIsInVzZXJfaWQiOjEsImVtYWlsIjoidGVzdHVzZXJAZXhhbXBsZS5jb20iLCJmaXJzdF9uYW1lIjoidGVzdCIsImxhc3RfbmFtZSI6InVzZXIiLCJpc19zdGFmZiI6ZmFsc2UsImlzX3N1cGVydXNlciI6ZmFsc2V9.-Bp-HQffYV-mmVV0x_UMNnmJVGvhZ1YRtlxyqtRslUE',
    refreshToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTk0Njk4OTQ5MywianRpIjoiZGU2YmRiYzMyOGQ2NDc3Njk4NTZiNjIzYzFkODQ1NDciLCJ1c2VyX2lkIjoxLCJlbWFpbCI6InRlc3R1c2VyQGV4YW1wbGUuY29tIiwiZmlyc3RfbmFtZSI6InRlc3QiLCJsYXN0X25hbWUiOiJ1c2VyIiwiaXNfc3RhZmYiOmZhbHNlLCJpc19zdXBlcnVzZXIiOmZhbHNlfQ.aPpzbtjVUcXS3jmdySOjGkI4KASpKyQWemwQB4cUjs8'
}


export const generateToken = (expire_seconds, token_type) => {
    return jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (expire_seconds),
        email: "testuser@example.com",
        first_name: "test",
        is_staff: false,
        is_superuser: false,
        last_name: "user",
        token_type: token_type,
        user_id: 1,
    }, 'secret');
};


const setTokens = async (accessToken, refreshToken) => {
    const tokens = JSON.stringify({accessToken: accessToken, refreshToken: refreshToken});
    await page.evaluate((tokens) => localStorage.setItem('auth-tokens-development', tokens), tokens);
}

export const setShortLivedAccessToken = async (expire_seconds) => {
    const accessToken = generateToken(expire_seconds, "access");
    const refreshToken = generateToken(60 * 60 * 24, "refresh");
    await setTokens(accessToken, refreshToken);
}

export const setShortLivedRefreshToken = async (expire_seconds) => {
    const accessToken = generateToken(expire_seconds);
    const refreshToken = generateToken(expire_seconds);
    console.log(Date.now(), accessToken, refreshToken)
    await setTokens(accessToken, refreshToken);
}
