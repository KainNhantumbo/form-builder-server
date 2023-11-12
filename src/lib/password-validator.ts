import PasswordValidator from 'password-validator';

export async function validatePasswords(data: string) {
  return await new Promise<{ success: boolean; message?: string }>(
    (resolve, reject) => {
      const schema = new PasswordValidator()
        .is()
        .min(8, 'The password should have a minimum of 8 characters')
        .is()
        .symbols(
          2,
          'The password should have a minimum of 2 special symbols, like @#+/*%!&.'
        )
        .is()
        .max(21, 'The password should not have a more than of 21 characters')
        .has()
        .not()
        .spaces(undefined, 'The password should not have spaces');

      const result = schema.validate(data, { details: true });

      if (result === false)
        reject({
          success: false,
          message:
            'Please use a strong password that contains at least 2 special characters.'
        });

      if (Array.isArray(result) && result.length > 0) {
        const errorMessage: string = result
          .map((obj) => obj?.message)
          .reduce((acc, current) => {
            const phrase = acc.concat(' ', current);
            return phrase;
          }, '');

        reject({ success: false, message: errorMessage });
      }

      resolve({ success: true });
    }
  );
}
