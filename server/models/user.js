const bcrypt = require('bcryptjs');
const sql = require('mssql');
const TABLE = "SYS_User"

// define the User model schema
class User {
  static comparePassword(password_1, password_2, callback) {
    return bcrypt.compare(password_1, password_2, callback);
  }
  static async findById(id) {
    try {
      const result = await sql.query`select * from BinhPhuocGIS.SYS_User where UserName = ${id}`
      if (result.recordset && result.recordset.length > 0)
        return result.recordset[0];
      else
        return null;
    } catch (error) {
      throw error;
    }

  }
}

/**
 * The pre-save hook method.
 */
// UserSchema.pre('save', function saveHook(next) {
//   const user = this;

//   // proceed further only if the password is modified or the user is new
//   if (!user.isModified('password')) return next();


//   return bcrypt.genSalt((saltError, salt) => {
//     if (saltError) { return next(saltError); }

//     return bcrypt.hash(user.password, salt, (hashError, hash) => {
//       if (hashError) { return next(hashError); }

//       // replace a password string with hash value
//       user.password = hash;

//       return next();
//     });
//   });
// });


module.exports = User;
