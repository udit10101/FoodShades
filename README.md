<h1 align="center">Welcome to FoodShades 🍻</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="#" target="_blank">
    <img alt="License: ISC" src="https://img.shields.io/badge/License-ISC-yellow.svg" />
  </a>
</p>

> Food Ordering Application

## Project Description
NOTE : We were unaware till the last moment that ejs was not allowed to use and we have used it only to make message templates to show messages like incorrect password
,details updated successfully,etc and with permission from aasf executives.

Food Ordering application for webkriti.

For Customers

- Users can create their account in our database and sign in.
- Once the user is successfully signed in, they will be redirected to the Homepage.
- The user can see all the restaurant currently available.
- The home page also contains a search bar to search for a particular restaurant by its name.
- The user can also sort the restaurants depending on various Categories like Chinese, Burgers, etc or according to the delivery time, Veg Only, Rating.
- The user can order from only one specific restaurant.
- Also, the user can view their order history in the Past Orders Page.
- Also, the user can view their personal details, and can also update them.
- Also, the user can change their current password.
- On the Restaurant Page, the user can search for a particular dish using the search bar.
- Once ordered the user can see the order details.
- Users can also rate the order.

For Restaurant Owners

- Restaurant Owners can login using the Restaurant Name and its corresponding password.
- The owner can update their current dish name, price, description, dish image, its category.
- The owner can also add new dishes on its current restaurant page.

# Screen shots

<img src="assets/images/landing_page1.jpeg"></img>
<img src="assets/images/landing_page2.jpeg"></img>
<img src="assets/images/signin1.jpeg"></img>
<img src="assets/images/signin2.jpeg"></img>
<img src="assets/images/feed.jpeg"></img>
<img src="assets/images/create_a_post.jpeg"></img>
<img src="assets/images/feedback.jpeg"></img>
<img src="assets/images/view_profile.jpeg"></img>
<img src="assets/images/edit_delete_post.jpeg"></img>
<img src="assets/images/edit_profile.jpeg"></img>
<img src="assets/images/startup.jpeg"></img>

### 🏠 [Homepage](/public)

### ✨ [Deployed site](https://foodshades.herokuapp.com/)

# Features Implemented

## Features

1. Landing page:

- The landing page contains the overview of the website about how we intend the users to use this website.

2. Sign in and sign up page :

- All the checks have been made on the frontend side for email and password. For example, we have defined the password pattern that the user must enter while signing up.

3. Home Page :

- Once the user is signed in, a user id is generated, saved in Local Storage, which helps maintain session activity. This user id is verified every time the user visits any page.
  A Sliding Banner is implemented, using JS and CSS.
  Once logged in, the browser would prompt for the users location, which will be displayed in the Navigation Bar.
  It also includes a Search Bar used to search for various restaurants.
  Once the restaurant is finalized by the user, they are transfered to that particular restaurant's page.

4. Restaurant Page :

- Restaurant Page contains various details regarding that restaurat, like delivery time, location, rating, restaurant type and the offers available at the moment. Below the restaurant banner, the user can view various dishes, and add them to the cart, on the right. After finalising the dishes the user can place the order and view its details on the Order Details Page.

5. Order Details Page :

- User can view the current order, all the dish details, along with the Bill Details. And there is also an option for rating the order, which then gets added to the restaurant's overall rating.

6. Past Order Page :

- User can view their accounts past order history, with the Total Bill and the exact date and time of the order, the restaurant's name.

7. Account Page :

- The account details of the user can be viewed and updated. The user can also change their current password, using the old password.

8. Restaurant Owner page :

- The restaurant owner can edit their existing dish, by using the Edit Dish Button, then a modal window would pop up, which contains the dish information, that can be edited - dish name, image link, price, catergory, and description.
- Now the onwer can also add new dish using the Add Dish Button, and all the above details must be filled.

# Technologies/Libraries/Packages Used

| Packages                | README                                                                                               |
| ----------------------- | ---------------------------------------------------------------------------------------------------- |
| bcrypt                  | To store hashed password in database                                                                 |
| dotenv                  | To keep db connection string, client id, client secret key safe                                      |
| nodemon                 | To run application in dev mode                                                                       |
| pg                      | To Connect to AWS RDS                                                                                |
| body-parser             | To process data sent in an HTTP request body                                                         |
| ejs                     | To Embed JavaScript code in a template that is then used to generate HTML                            |
| express-flash           | To Implement flash messages                                                                          |
| express-session         | To store or access session data                                                                      |
| passport                | to authenticate requests, which it does through an extensible set of plugins known as strategies     |
| passport-local          | Passport strategy for authenticating with a username and password                                    |




## Local Setup

Note that database connection string, passport client id & secret keys are in env file which are not uploaded on github

### Built With

<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original-wordmark.svg" alt="html5" width="40" height="40" style="max-width:100%;"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original-wordmark.svg" alt="css3" width="40" height="40" style="max-width:100%;"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" alt="javascript" width="40" height="40" style="max-width:100%;"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg" alt="nodejs" width="40" height="40" style="max-width:100%;"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original-wordmark.svg" alt="postgresql" width="40" height="40" style="max-width:100%;"><a href="https://expressjs.com" target="_blank"> <img src="https://www.vectorlogo.zone/logos/expressjs/expressjs-ar21.svg" alt="express" height="40"/> </a>

## Contact

👤 **Udit Karan Tomar,Pranav Panwar**

### Udit Karan Tomar (2021IMT-104)

- Github: [@udit10101](hhttps://github.com/udit10101)
- LinkedIn: [@udit-tomar](https://www.linkedin.com/in/udit-tomar-a07323235/)
- Gmail: [mail](mailto:bandarysohan24@gmail.com)
- Instagram: [@uditktomar](https://www.instagram.com/uditktomar/)

### Pranav Panwar (2021IMT-074)

- Github: [@pawarpranav83](https://github.com/pawarpranav83)
- LinkedIn: [@pranav-pawar](https://www.linkedin.com/in/pranav-pawar-b54954242/)
- Gmail: [mail](mailto:pawar.pranav83@gmail.com)
- Instagram: [@pranav.pawar_](https://www.instagram.com/pranav.pawar_/)

## Show your support

Give a ⭐️ if this project helped you!
