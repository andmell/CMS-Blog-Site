# CMS-Blog-Site
A blog site where developers can publish their blog post.

## Description

This test blog site allows users to view, create, and comment on posts that other users have made. The motivation behind this project was to experiment with a model view controller, in this case Handlebars, to create templates that dynamically update in accordance to different user data. 

 Express-session ensures a user must be logged in to interact with certain aspects of this website, especially when doing CRUD operations. Non-authenticated users are limited to reading data, but nothing else. 

 Bulma was used to style the interface of this website. This site also makes use of MySQL to handle all relational database concerns. Bcrypt is utilized to ensure user data is encrypted when being sent to and from the database, to allow for better user protection. Of course, this site also uses Sequelize object-relational mapping for the MySQL database, and Express as a web application framework for Node.js.

 ## Usage
 No installation is necessary. This website is deployed on Heroku [here](https://powerful-anchorage-88004-307e877c2bcf.herokuapp.com/). Please feel free to create an account and navigate throughout the site. 