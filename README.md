# Quiz World
A web app for quizzing developed using Go and React.
## Description:
The app presents a ***Bootstrap 4*** styled UI in ***React*** supported by a ***Go*** server which implements features such as but not limited to, authentication, registration and quizzing capabilities along with admin support which allows admins to modify genres, quizzes and questions.

## Technologies used:
* [React](https://reactjs.org/)
* [Go](https://golang.org/)
* [Bootstrap 4](http://getbootstrap.com/)

## Setting up:
### React
  - Install **node**
    - Ubuntu:
      ```bash
        curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
        sudo apt-get install -y nodejs
      ```
    - MacOS:
      ```bash
        brew install node
      ```
  - Install **yarn**
      ```bash
        npm install -g yarn
        yarn global add create-react-app
      ```
  - Install packages for **React**:
    ```bash
      cd ./quiz-app/quiz-app-react/
      npm install
      yarn install
    ```

### Go  
  - Install **Go**
    - For Ubuntu: [Look here](https://www.linode.com/docs/development/go/install-go-on-ubuntu/)
    - For MacOS: [Look here](http://sourabhbajaj.com/mac-setup/Go/README.html)
  - Install Go packages by running the following commands on your terminal:
    ```bash
      go get -u -v golang.org/x/crypto/bcrypt
      go get -u -v github.com/gin-contrib/cors
      go get -u -v github.com/gin-gonic/gin
      go get -u -v github.com/jinzhu/gorm
    ```

## To run:
After set-up, run:
- In the [frontend directory](./frontend/), run  
  ```bash
    nodemon
  ``` 
- In the [root directory](./), run
  ```bash
    go run app.go
  ```

## Sample Images:

***Index Page***

![Index Page](./sample-images/index.png)

***Login Page***

![Login Page](./sample-images/login.png)

***Signup Page***

![Signup Page](./sample-images/signup.png)

***User's Index Page***

![Logged in Index Page](./sample-images/logged_in_index.png)

***Genres catalog for admin***

![Genres catalog for admin](./sample-images/genres_admin.png)

***Quizzes catalog for admin***

![Quizzes catalog for admin](./sample-images/sports_quizzes_admin.png)

***Soccer Quiz (Admin View)***

![Soccer Quiz](./sample-images/soccer_quiz_admin.png)

***Leaderboard across Genres***

![Leaderboard](./sample-images/all_leaderboard.png)

***Person Performance***

![Performance](./sample-images/performance.png)

***Genre Control***

![Genre Control](./sample-images/admin_panel.png)

More sample images ***[here](./sample-images/)***
