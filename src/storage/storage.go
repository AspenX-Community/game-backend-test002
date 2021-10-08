package storage

import (
	"fmt"
	"log"
	"os"
	"reflect"
	"strings"

	"gopkg.in/mgo.v2/bson"
)

// Constante #define MINHA_COSNTANTE 10
const STORAGE_PATH = "../storage"
const STORAGE_INDEX = "/" + "index.bin"

type Dao struct {
	path      string
	pathIndex string
	namespace string
	// Mapa das reigioes de ID
	mappingIndex map[string][]string
	// Mapa com os objetos
	list       map[string]interface{}
	repository Repository
	// Funcoes que lidam com o mapeamento
	addMappingIndex    func(string, interface{})
	removeMappingIndex func(string)
	addMapping         func(string, interface{})
	removeMapping      func(string)
}

//  Mapa que aplica um sketon em todos os dados
var mapping map[string]Dao

// Funcao que monta o build
func Use(entity interface{}) FabricRepository {

	if mapping == nil {
		mapping = make(map[string]Dao)
	}

	name := strings.ToLower(getNameEntity(&entity))
	createDir(STORAGE_PATH)

	return FabricRepository{
		Build: func() Repository {

			path := STORAGE_PATH + "/" + name
			createDir(path)

			var repository Repository
			if v, ok := mapping[name]; !ok {

				repository = Repository{
					namespace: name,
					Save: func(object interface{}) {

						Id := reflect.ValueOf(object).Elem().FieldByName("Id")

						if Id.IsZero() {
							fmt.Println("O Id não pode ser Vazio!!")
							return
						}

						mapping[name].addMapping(Id.String(), object)

					},
					// Pega
					Get: func(int) {

					},
					// Remove
					Remove: func(int) {

					},
					// Atualiza
					Update: func(entity interface{}) {

					},
					// Limpa
					Clear: func() {

					},
				}
				mapping[name] = Dao{
					path:         path,
					pathIndex:    path + STORAGE_INDEX,
					namespace:    name,
					mappingIndex: make(map[string][]string),
					list:         make(map[string]interface{}),
					repository:   repository,
					addMappingIndex: func(string, interface{}) {

					},
					removeMappingIndex: func(string) {

					},
					addMapping: func(id string, object interface{}) {

						mapping[name].list[id] = object

					},
					removeMapping: func(string) {

					},
				}

				return mapping[name].repository

			} else {

				return v.repository

			}
		},
	}
}

func getNameEntity(entity *interface{}) string {
	if t := reflect.TypeOf(entity); t.Kind() == reflect.Ptr {
		return t.Elem().Name()
	} else {
		return t.Name()
	}
}

func createDir(dir string) {

	_, err := os.Stat(dir)

	if os.IsNotExist(err) {
		errDir := os.MkdirAll(dir, 0755)
		if errDir != nil {
			log.Fatal(err)
		}

	}
}

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

/* Funcoes que cuidado do sistema de arquivos do storage, falta algumas validações */
func toBSON(ent interface{}) []byte {
	data, err := bson.Marshal(ent)
	if err != nil {
		panic(err)
	}
	return data
}

func readInArray(byteArray []byte, obj *interface{}) {
	if err := bson.Unmarshal(byteArray, obj); err != nil {
		panic(err)
	}
}

/*
func saveInFile(filename string, data []byte) {
	ioutil.WriteFile(filename, data, 0644)
}
func readInFile(filename string, obj interface{}) {

	content, err := ioutil.ReadFile(filename)
	if err != nil {
		panic(err)
	}

	readInArray(content, obj)

}
*/
