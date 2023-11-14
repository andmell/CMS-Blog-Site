// const session = require('express-session'); 

const withAuth = (req, res, next) => { // Added standard withAuth function with a req, res, and callback to pass to a new route.
    if (!req.session.user_id) { // Added a conditional to see if the user_id property doesn't exist in the request from express-session's req.session object.
        res.redirect('/login'); // If the conditional passes send the user the login template view.
    } else {
        next(); // If the user is logged in and user_id is present in req.session, the user is authenticated and control is passed to the next route or middleware.
    };    
};

module.exports = withAuth; // Used module.exports so that withAuth can be imported and used elsewhere.
