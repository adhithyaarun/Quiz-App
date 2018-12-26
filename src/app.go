package main

import (
   "fmt"
   "net/http"
   "github.com/gin-contrib/cors"
   "github.com/gin-gonic/gin"
   "github.com/jinzhu/gorm"
   _ "github.com/jinzhu/gorm/dialects/sqlite"
   "./models"
   "./utilities"
)

var db *gorm.DB
var err error

func main() {
  db, err = gorm.Open("sqlite3", "./gorm.db")
  if err != nil {
    fmt.Println(err)
  }
  defer db.Close()

  db.AutoMigrate(&models.Score{},
                 &models.User{},
                 &models.Question{},
                 &models.Quiz{},
                 &models.Genre{},
                 &models.Option{})

  r := gin.Default()

  r.GET("/", Index)

  r.POST("/signup/", Signup)
  r.POST("/login/", Login)

  r.GET("/users/", GetUsers)
  r.DELETE("/users/delete", DeleteUser)
  r.PUT("/users/grant", GrantAdmin)

  r.GET("/explore/", ExploreGenres)
  r.GET("/explore/:genre", ExploreQuizzes)
  r.GET("/quiz/:quizid", GetQuestions)

  r.POST("/create/genre", CreateGenre)
  r.DELETE("/delete/genre", DeleteGenre)
  r.GET("/genre/:genre", GetGenre)

  r.POST("/create/quiz/:genre", CreateQuiz)
  r.DELETE("/delete/quiz/:genre", DeleteQuiz)
  r.GET("/get/quiz/", GetAllQuizzes)

  r.GET("/question/:questionid", GetQuestion)
  r.POST("/create/question/:quizid", AddQuestion)
  r.DELETE("/delete/question/:questionid", DeleteQuestion)
  r.PUT("/update/question/", UpdateQuestion)

  r.POST("/create/option/", AddOption)
  r.PUT("/update/option/", UpdateOption)
  r.DELETE("/delete/option/:optionid", DeleteOption)

  r.POST("/submit/", SubmitQuiz)

  r.GET("/leaderboard/", LeaderboardAll);
  r.GET("/leaderboard/:genreid", LeaderboardGenre)

  r.GET("/performance/:userid", GetPerformance)

  r.Use((cors.Default()))
  r.Run(":8080")
}

func Index(context *gin.Context) {
  context.Header("access-control-allow-origin", "*")
  context.AbortWithStatus(200)
}

func Signup(context *gin.Context) {
   var user models.User
   context.BindJSON(&user)
   if user.Username == "" || user.Password == "" || user.FirstName == "" || user.LastName == "" {
     context.AbortWithStatus(400)
   }
   user.Password = utilities.GeneratePassword(user.Password)
   db.Create(&user)
   context.Header("access-control-allow-origin", "*")
   context.JSON(http.StatusOK, user)
}

func Login(context *gin.Context) {
  var requestBody utilities.Authentication
  var user models.User
  context.BindJSON(&requestBody)
  if err := db.Where("username = ?", requestBody.Username).First(&user).Error; err != nil {
    context.Header("access-control-allow-origin", "*")
    context.AbortWithStatus(http.StatusNotFound)
    fmt.Println(err)
  } else {
    passwordCorrect := utilities.CheckPassword(requestBody.Password, []byte(user.Password))
    if passwordCorrect == true {
      fmt.Println("Authenticated\n")
      context.Header("access-control-allow-origin", "*")
      context.JSON(http.StatusOK, user)
    } else {
      context.Header("access-control-allow-origin", "*")
      context.JSON(401, gin.H{"authenticated": false})
    }
  }
}

func GetUsers(context *gin.Context) {
  var users []models.User

  if err := db.Find(&users).Error; err != nil {
    context.Header("access-control-allow-origin", "*")
    context.AbortWithStatus(http.StatusNotFound)
    fmt.Println(err)
  } else {
    context.Header("access-control-allow-origin", "*")
    context.JSON(http.StatusOK, users)
  }
}

func DeleteUser(context *gin.Context) {
  var req_user models.User
  var user models.User
  context.BindJSON(&req_user)
  d := db.Where("id = ?", req_user.ID).Delete(&user)
  fmt.Println(d)
  context.Header("access-control-allow-origin", "*")
  context.JSON(http.StatusOK, gin.H{"Deleted": user.Username})
}

func GrantAdmin(context *gin.Context) {
  var user models.User
  context.BindJSON(&user)
  user.Admin = true
  db.Save(&user)
  context.Header("access-control-allow-origin", "*")
  context.JSON(http.StatusOK, gin.H{"Granted": user.Username})
}

func ExploreGenres(context *gin.Context) {
  var genres []models.Genre

  if err := db.Find(&genres).Error; err != nil {
    context.Header("access-control-allow-origin", "*")
    context.AbortWithStatus(http.StatusNotFound)
    fmt.Println(err)
  } else {
    context.Header("access-control-allow-origin", "*")
    context.JSON(http.StatusOK, genres)
  }
}

func ExploreQuizzes(context *gin.Context) {
  genre_name := context.Params.ByName("genre")
  var genre models.Genre
  var quizzes []models.Quiz

  if err := db.Where("name = ?", genre_name).First(&genre).Error; err != nil {
    context.AbortWithStatus(http.StatusNotFound)
    fmt.Println(err)
  }

  db.Model(&genre).Related(&quizzes)
  context.Header("access-control-allow-origin", "*")
  context.JSON(http.StatusOK, quizzes)
}

func GetQuestions(context *gin.Context) {
  id := context.Params.ByName("quizid")
  var quiz models.Quiz
  var questions []models.Question

  if err := db.Where("id = ?", id).First(&quiz).Error; err != nil {
    context.AbortWithStatus(http.StatusNotFound)
    fmt.Println(err)
  }

  db.Model(&quiz).Related(&questions)
  for i, question := range questions {
    var options []models.Option
    db.Model(&question).Related(&options)
    questions[i].Options = append(questions[i].Options, options...)
  }
  context.Header("access-control-allow-origin", "*")
  context.JSON(http.StatusOK, questions)
}

func CreateGenre(context *gin.Context) {
  // To be extended
  var req_genre models.Genre
  var genre_found models.Genre
  context.BindJSON(&req_genre)
  err := db.Where("name = ?", req_genre.Name).First(&genre_found).Error
  if err == nil {
    context.Header("access-control-allow-origin", "*")
    context.AbortWithStatus(http.StatusBadRequest)
    fmt.Println(err)
  } else {
    db.Create(&req_genre)
    context.Header("access-control-allow-origin", "*")
    context.JSON(http.StatusOK, req_genre)
  }
}

func DeleteGenre(context *gin.Context) {
  // To be extended
  var req_genre models.Genre
  var genre_found models.Genre
  var genre models.Genre
  context.BindJSON(&req_genre)
  err := db.Where("name = ?", req_genre.Name).First(&genre_found).Error
  if err != nil {
    context.Header("access-control-allow-origin", "*")
    context.AbortWithStatus(http.StatusNotFound)
    fmt.Println(err)
  } else {
    d := db.Where("id = ?", genre_found.ID).Delete(&genre)
    fmt.Println(d)
    context.Header("access-control-allow-origin", "*")
    context.JSON(http.StatusOK, gin.H{"Deleted": genre.Name})
  }
}

func GetGenre(context *gin.Context) {
  name := context.Params.ByName("genre")
  var genre models.Genre
  if err := db.Where("name = ?", name).First(&genre).Error; err != nil {
     context.AbortWithStatus(404)
     fmt.Println(err)
  } else {
     context.Header("access-control-allow-origin", "*")
     context.JSON(200, genre)
  }
}

func CreateQuiz(context *gin.Context) {
  var req_quiz models.Quiz
  var quiz_found models.Quiz
  context.BindJSON(&req_quiz)
  err := db.Where("name = ?", req_quiz.Name).First(&quiz_found).Error
  if err == nil {
    context.Header("access-control-allow-origin", "*")
    context.AbortWithStatus(http.StatusBadRequest)
    fmt.Println(err)
  } else {
    db.Create(&req_quiz)
    context.Header("access-control-allow-origin", "*")
    context.JSON(http.StatusOK, req_quiz)
  }
}

func DeleteQuiz(context *gin.Context) {
  var req_quiz models.Quiz
  var quiz_found models.Quiz
  var quiz models.Quiz
  context.BindJSON(&req_quiz)
  err := db.Where("name = ? AND genre_id = ?", req_quiz.Name, req_quiz.GenreID).First(&quiz_found).Error
  if err != nil {
    context.Header("access-control-allow-origin", "*")
    context.AbortWithStatus(http.StatusNotFound)
    fmt.Println(err)
  } else {
    d := db.Where("id = ?", quiz_found.ID).Delete(&quiz)
    fmt.Println(d)
    context.Header("access-control-allow-origin", "*")
    context.JSON(http.StatusOK, gin.H{"Deleted": quiz.Name})
  }
}

func GetQuestion(context *gin.Context) {
  var question models.Question
  var options []models.Option
  id := context.Params.ByName("questionid")

  if err := db.Where("id = ?", id).First(&question).Error; err != nil {
    context.Header("access-control-allow-origin", "*")
    context.AbortWithStatus(http.StatusNotFound)
    fmt.Println(err)
  } else {
    db.Model(&question).Related(&options)
    question.Options = append(question.Options, options...)
    context.Header("access-control-allow-origin", "*")
    context.JSON(http.StatusOK, question)
  }
}

func AddQuestion(context *gin.Context) {
  var question models.Question
  context.BindJSON(&question)
  db.Create(&question)
  context.Header("access-control-allow-origin", "*")
  context.JSON(http.StatusOK, question)
}

func DeleteQuestion(context *gin.Context) {
  var question models.Question
  id := context.Params.ByName("questionid")
  if err := db.Where("id = ?", id).Delete(&question).Error; err != nil {
    context.Header("access-control-allow-origin", "*")
    context.AbortWithStatus(http.StatusNotFound)
    fmt.Println(err)
  }
  context.Header("access-control-allow-origin", "*")
  context.JSON(http.StatusOK, gin.H{"Deleted": question.ID})
}

func UpdateQuestion(context *gin.Context) {
  var question models.Question
  var check_question models.Question
  context.BindJSON(&question)
  if err := db.Where("id = ?", question.ID).First(&check_question).Error; err != nil {
    context.Header("access-control-allow-origin", "*")
    context.AbortWithStatus(http.StatusNotFound)
  } else {
    db.Save(&question)
    context.Header("access-control-allow-origin", "*")
    context.JSON(http.StatusOK, question)
  }
}

func UpdateOption(context *gin.Context) {
  var option models.Option
  var check_option models.Option
  context.BindJSON(&option)
  if err := db.Where("id = ?", option.ID).First(&check_option).Error; err != nil {
    context.Header("access-control-allow-origin", "*")
    context.AbortWithStatus(http.StatusNotFound)
  } else {
    db.Save(&option)
    context.Header("access-control-allow-origin", "*")
    context.JSON(http.StatusOK, option)
  }
}

func DeleteOption(context *gin.Context) {
  var option models.Option
  id := context.Params.ByName("optionid")
  if err := db.Where("id = ?", id).Delete(&option).Error; err != nil {
    context.Header("access-control-allow-origin", "*")
    context.AbortWithStatus(http.StatusNotFound)
    fmt.Println(err)
  }
  context.Header("access-control-allow-origin", "*")
  context.JSON(http.StatusOK, gin.H{"Deleted": option.ID})
}

func AddOption(context *gin.Context) {
  var option models.Option
  context.BindJSON(&option)
  db.Create(&option)
  context.Header("access-control-allow-origin", "*")
  context.JSON(http.StatusOK, option)
}

func SubmitQuiz(context *gin.Context) {
  var score models.Score
  var score_record models.Score
  var quiz models.Quiz
  var user models.User
  context.BindJSON(&score)
  if err := db.Where("id = ?", score.QuizID).First(&quiz).Error; err != nil {
    context.Header("access-control-allow-origin", "*")
    context.AbortWithStatus(http.StatusNotFound)
    fmt.Println(err)
  } else {
    score.GenreID = quiz.GenreID
    db.Where("id = ?", score.UserID).First(&user)
    if err2 := db.Where("user_id = ? AND quiz_id = ? AND genre_id = ?", score.UserID, score.QuizID, score.GenreID).First(&score_record).Error; err2 != nil {
      score.Attempts = 1
      score.Username = user.Username
      db.Create(&score)
      user.TotalScore = user.TotalScore + score.Value
      db.Save(&user)
      context.Header("access-control-allow-origin", "*")
      context.JSON(http.StatusOK, score)
    } else {
      user.TotalScore = user.TotalScore - score_record.Value + score.Value
      db.Save(&user)
      score_record.Value = score.Value
      score_record.Attempts = score_record.Attempts+1
      db.Save(&score_record)
      context.Header("access-control-allow-origin", "*")
      context.JSON(http.StatusOK, score_record)
    }
  }
}

func LeaderboardAll(context *gin.Context) {
  var users []models.User
  db.Order("total_score desc").Find(&users)
  context.Header("access-control-allow-origin", "*")
  context.JSON(http.StatusOK, users)
}

func LeaderboardGenre(context *gin.Context) {
  var scores []models.Score
  id := context.Params.ByName("genreid")
  db.Where("genre_id = ?", id).Order("value desc").Find(&scores)
  context.Header("access-control-allow-origin", "*")
  context.JSON(http.StatusOK, scores)
}

func GetPerformance(context *gin.Context) {
  var scores []models.Score
  var user models.User
  id := context.Params.ByName("userid")
  db.Where("id = ?", id).First(&user)
  db.Model(&user).Related(&scores)
  user.Scores = append(user.Scores, scores...)
  context.Header("access-control-allow-origin", "*")
  context.JSON(http.StatusOK, user)
}

func GetAllQuizzes(context *gin.Context) {
  var quizzes []models.Quiz
  db.Find(&quizzes)
  context.Header("access-control-allow-origin", "*")
  context.JSON(http.StatusOK, quizzes)
}
