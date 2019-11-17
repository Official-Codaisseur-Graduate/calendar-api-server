const User = require("../user/model")
const bcrypt = require("bcryptjs")

const superAdmin = process.env.SUPERADMIN || "your@email.com"  // the admin email when the app is deployed to heroku
const saPassword = process.env.SAPASSWORD || "secret" //the admin password when the app is deployed to heroku


/* checkSuperAdmin function checks if super admin exists, if not create an entry of super admin
    the entry in atabse contains:
      -- the email,
      -- the encrypted password
      -- rank

    Super Admin's rank is always 4
*/
const checkSuperAdmin = async () => {
  const encryptedPassword = await bcrypt
    .hashSync(saPassword, 10)
  User.findOrCreate({
    where: { email: superAdmin },
    defaults: {
      name: "Super Admin",
      password: encryptedPassword,
      rank: 4,
    }
  })
}

module.exports = { superAdmin, checkSuperAdmin }