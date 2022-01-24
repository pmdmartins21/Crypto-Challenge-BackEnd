const passport = require('passport');
const passportJwt = require('passport-jwt');

const secret = 'CdTp!DWM@202122';

const { Strategy, ExtractJwt } = passportJwt;

module.exports = (app) => {
  const params = {
    secretOrKey: secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  };

  const strategy = new Strategy(params, (payload, done) => {
    app.services.user.findOne({ id: payload.id })
      .then((user) => {
        if (user) done(null, { ...payload });
        else done(null, false); // testar
      }).catch((err) => done(err, false)); // testar
  });

  passport.use(strategy);

  return {
    authenticate: () => passport.authenticate('jwt', { session: false }),
  };
};
