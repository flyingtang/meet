package controllers

import (
	"fmt"
	"io"
	"net/http"

	"github.com/julienschmidt/httprouter"
)


func IndexHandle (w http.ResponseWriter, r *http.Request, ps httprouter.Params){
	fmt.Println("index")
	w.WriteHeader(200)
	io.WriteString(w, "nihao ")
}