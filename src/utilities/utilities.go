package utilities

import (
  _ "fmt"
  "log"
  "golang.org/x/crypto/bcrypt"
)

type Authentication struct {
  Username string `json:"username"`
  Password string `json:"password"`
}

func GeneratePassword(password string) string{
  hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
  if err != nil {
    log.Fatal(err)
  }

  hashedPassword := string(hash)

  return hashedPassword
}

func CheckPassword(userPassword string, correctPassword []byte) bool {
  if err := bcrypt.CompareHashAndPassword(correctPassword, []byte(userPassword)); err != nil {
    return false
  }

  return true
}
