const bcrypt = require('bcryptjs');
return bcrypt.genSalt((saltError, salt) => {
  if (saltError) { return next(saltError); }

  return bcrypt.hash('ditagis@123', salt, (hashError, hash) => {
    if (hashError) { return next(hashError); }

    // replace a password string with hash value
    console.log(hash);
  })
})