package main

import (
	"Myproject/src/storage"
	"Myproject/src/web"
)

type Usuario struct{}

func main() {

	WebServer := web.Build(8080)

	storage.Use(Usuario{}).Build()

	defer WebServer.Start()

}
