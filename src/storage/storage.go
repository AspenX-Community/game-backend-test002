package storage

import (
	"fmt"
	"reflect"
)

type FabricRepository struct {
	Build func() Repository
}

type Repository struct {
	namespace string
	// Salva
	Save func(interface{})
	// Pega
	Get func(int)
	// Remove
	Remove func(int)
	// Atualiza
	Update func(interface{})
	// Limpa
	Clear func()
}

func Use(entity interface{}) FabricRepository {

	name := getNameEntity(entity)
	fmt.Println(name)

	return FabricRepository{
		Build: func() Repository {
			fmt.Println("Repositorio Fabricado!!!")
			return Repository{
				namespace: name,
				Save: func(interface{}) {

				},
				// Pega
				Get: func(int) {

				},
				// Remove
				Remove: func(int) {

				},
				// Atualiza
				Update: func(interface{}) {

				},
				// Limpa
				Clear: func() {

				},
			}
		},
	}
}

func getNameEntity(entity interface{}) string {
	if t := reflect.TypeOf(entity); t.Kind() == reflect.Ptr {
		return "*" + t.Elem().Name()
	} else {
		return t.Name()
	}
}

