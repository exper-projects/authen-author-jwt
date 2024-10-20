import * as bcrypt from 'bcrypt';

export const hashStr = (input: string): Promise<string> =>
  bcrypt.hash(input, 10);
