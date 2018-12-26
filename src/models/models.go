package models

import (
   _ "fmt"
   _ "github.com/gin-contrib/cors"
   _ "github.com/gin-gonic/gin"
   _ "github.com/jinzhu/gorm"
   _ "github.com/jinzhu/gorm/dialects/sqlite"
)

type Score struct {
  ID uint `json: "id"`
  Username string `json:"username"`
  UserID uint `json:"userid"`
  QuizID uint `json:"quizid"`
  GenreID uint `json:"genreid"`
  Value uint `json:"value"`
  Attempts uint `json:"attempts"`
}

type User struct {
  ID uint `json:"id"; gorm:"primary_key"`
  Username string `json:"username"; gorm:"unique"`
  Password string `json:"password"`
  FirstName string `json:"firstname"`
  LastName string `json:"lastname"`
  Scores []Score `json:"scores"`
  TotalScore uint `json:"totalscore"`
  Admin bool `json:"admin"; gorm:"false"`
}

type Option struct {
  ID uint `json:"id"; gorm:"primary_key"`
  Content string `json:"content"`
  QuestionID uint `json:questionid`
  Correct bool `json:"correct"`
}

type Question struct {
  ID uint `json:"id"; gorm:"primary_key"`
  QuizID uint `json:"quizid"`
  Question string `json:"question"`
  Options []Option `json:"options"`
  NumberCorrect uint `json:"numcorrect"`
}

type Quiz struct {
  ID uint `json:"id"; gorm:"primary_key"`
  GenreID uint `json:"genre"`
  Name string `json:"name"; gorm:"unique"`
  Questions []Question `json:"questions"`
}

type Genre struct {
  ID uint `json:"id"; gorm:"primary_key"`
  Name string `json:"name"; gorm:"unique"`
  Quizzes []Quiz `json:"quizzes"`
}
