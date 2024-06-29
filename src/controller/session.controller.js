const passport = require('passport')
const usersModel = require('../service/index.js')

class SessionController {
    githubAuth = passport.authenticate('github', { scope: 'user:email' }, async (req, res) => { })

    githubCallback = (req, res, next) => {
        passport.authenticate('github', { failureRedirect: '/login' }, (err, user) => {
            if (err) {
                console.error(err)
                return res.status(500).json({ message: 'Authentication error' })
            }
            if (!user) {
                return res.redirect('/login')
            }
            req.logIn(user, (err) => {
                if (err) {
                    console.error(err)
                    return res.status(500).json({ message: 'Login error' })
                }
                req.session.user = user
                return res.redirect('http://localhost:5173/')
            })
        })(req, res, next)
    }
    

    getCurrentUser = async (req, res) => {
        if (req.isAuthenticated()) {
            res.json({ user: req.user });
          } else {
            res.status(401).json({ error: 'Not authenticated' });
          }
    }

    login = (req, res, next) => {
        passport.authenticate('login', (error, user, info) => {
          if (error) {
            console.log('Server error:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
          }
          if (!user) {
            console.log('Authentication failed: incorrect email or password');
            return res.status(401).json({ error: 'Email or password incorrect' });
          }
          req.logIn(user, (error) => {
            if (error) {
              console.log('Login error:', error);
              return res.status(500).json({ error: 'Internal Server Error' });
            }
            console.log('Login successful:', { first_name: user.first_name, cart: user.cart });
            return res.status(200).json({ message: 'Login successful', first_name: user.first_name , email: user.email, role: user.role, last_name: user.last_name, cart:user.cart});
          });
        })(req, res, next);
      };
      
      

    register = (req, res, next) => {
        passport.authenticate('register', (error, user, info) => {
            if (error) {
                return next(error)
            }
            if (!user) {
                req.session.error = 'Error registering user'
                return res.redirect('/register')
            }
            req.logIn(user, (error) => {
                if (error) {
                    return next(error)
                }
                return res.redirect('/login')
            })
        })(req, res, next)
    }

    logout = (req, res) => {
        req.session.destroy(error => {
            if (error) return res.send({ status: 'error', error: error })
            else return res.redirect("http://localhost:5173/login")
        })
    }
}

module.exports = new SessionController()
