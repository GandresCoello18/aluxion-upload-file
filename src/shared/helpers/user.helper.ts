import { GenderUser, EnumGenderUser } from 'src/services/users/user.model';

export const validGenderUser = (options: { gender: GenderUser }) => {
  if (Object.values(EnumGenderUser).includes(options.gender)) return true;
  return false;
};
