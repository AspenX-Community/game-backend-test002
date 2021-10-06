package web

import (
	"fmt"
	"log"
	"net/http" // será necessario usar o "go mod init Myproject" no terminal
	"strconv"

	socketio "github.com/googollee/go-socket.io"
)

type ServerWeb struct {
	Socket *socketio.Server
	Start  func()
}

func Build(port int) ServerWeb {

	portListen := strconv.Itoa(port)

	fmt.Println(portListen)
	server := socketio.NewServer(nil)

	http.Handle("/socket.io/", server)
	http.Handle("/", http.FileServer(http.Dir("../root")))

	return ServerWeb{
		Socket: server,
		Start: func() {
			go server.Serve()
			defer server.Close()

			log.Println("Serving at localhost:" + portListen)
			log.Fatal(http.ListenAndServe(":"+portListen, nil))
		},
	}
}
