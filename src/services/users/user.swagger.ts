export const SUCCESS_RESPONSE_REGISTER_USER = {
  message: 'User created successfully',
  user: {
    idUser: '699914de-de.......',
    createdAt: '2025-02-02T07:34:51.939Z',
    updatedAt: '2025-02-02T07:34:51.939Z',
    passwordResetTokens: [],
    name: 'Andres',
    lastName: 'Coello',
    email: 'goyeselcoca@gmail.com',
    password: '',
    gender: 'man',
  },
};
export const FAIL_RESPONSE_REGISTER_USER = {
  message: 'User already exists',
  error: 'Bad Request',
  statusCode: 400,
};
export const FAIL_RESET_PASSWORD_USER = {
  message: 'Invalid or expired token',
  error: 'Bad Request',
  statusCode: 400,
};
export const SUCCESS_RESET_PASSWORD_USER = {
  message: 'Password updated successfully',
};
export const FAIL_TOKEN_NOT_FOUND_USER = {
  message: 'Token not found',
  error: 'Bad Request',
  statusCode: 400,
};
export const SUCCESS_GET_ME_USER = {
  idUser: '699914de-de......',
  name: 'Andres',
  lastName: 'Coello',
  email: 'goyeselcoca@gmail.com',
  password: '',
  gender: 'man',
  createdAt: '2025-02-02T07:34:51.939Z',
  updatedAt: '2025-02-02T08:22:49.000Z',
};
export const SUCCESS_UPDATE_USER = {
  message: 'User updated successfully',
  user: {
    idUser: '699914de-de.......',
    name: 'Juanito',
    lastName: 'Coello',
    email: 'goyeselcoca@gmail.com',
    password: '',
    gender: 'man',
    createdAt: '2025-02-02T07:34:51.939Z',
    updatedAt: '2025-02-02T08:36:22.000Z',
  },
};
export const SUCCESS_REMOVE_USER = {
  message: 'User deleted successfully',
};
