package main

import (
	"meet/api/controllers"
	"meet/api/middlewares"
	"meet/api/routers"
	"net/http"
)

func main() {

	r := routers.New()
	r.Use(middlewares.Log)
	//auth := r.Group("/admin", middlewares.Auth)
	r.GET("/", controllers.IndexHandle)
	http.ListenAndServe(":4000", r)
}
