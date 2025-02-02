export const AUTH_RESPONSE_SUCCESS_LOGIN = {
  message: 'Login successful',
  user: {
    me: {
      idUser: '699914de-de......',
      name: 'andres',
      lastName: 'coello',
      email: 'goyeselcoca@gmail.com',
      password: '',
      gender: 'man',
      createdAt: '2025-02-02T07:34:51.939Z',
      updatedAt: '2025-02-02T07:34:51.939Z',
    },
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXV........',
    refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX......',
  },
};
export const AUTH_RESPONSE_INVALID_CREDENTIALS = {
  message: 'Invalid credentials',
  error: 'Bad Request',
  statusCode: 400,
};
