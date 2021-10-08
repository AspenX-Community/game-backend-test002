package main

import (
	"Myproject/src/storage"
	"Myproject/src/web"
)

type Usuario struct {
	Id   string
	Nome string
}

func main() {

	WebServer := web.Build(8080)

	repository := storage.Use(Usuario{}).Build()

	user := Usuario{
		Id:   "sadsada",
		Nome: "Gilberto",
	}
	repository.Save(&user)

	defer WebServer.Start()

}
