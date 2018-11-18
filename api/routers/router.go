package routers

import (
	"net/http"
	"path/filepath"
	"strings"

	"github.com/julienschmidt/httprouter"
)

type middleware func(httprouter.Handle) httprouter.Handle

//IRouter custom router handle
type IRouter struct {
	middlewares []middleware
	path        string
	router      *httprouter.Router
}

//New new a i router
func New() *IRouter {
	return &IRouter{router: httprouter.New()}
}

// JoinPath
func (i *IRouter) joinPath(path string) string {
	p := filepath.Join(i.path, path)
	if !strings.HasPrefix(p, "/") {
		panic("path should start with '/'")
	}
	return p
}

//Group router group
func (i *IRouter) Group(path string, m ...middleware) *IRouter {
	p := i.joinPath(path)
	return &IRouter{
		middlewares: append(m, i.middlewares...),
		path:        p,
		router:      i.router,
	}
}

//Use 中间件
func (i *IRouter) Use(m ...middleware) *IRouter {
	i.middlewares = append(m, i.middlewares...)
	return i
}

//Handle ...
func (i *IRouter) Handle(method string, path string, handle httprouter.Handle) {
	for _, v := range i.middlewares {
		handle = v(handle)
	}
	p := i.joinPath(path)
	i.router.Handle(method, p, handle)
}

//GET ...
func (i *IRouter) GET(path string, handle httprouter.Handle) {
	i.Handle(http.MethodGet, path, handle)
}

//HEAD ...
func (i *IRouter) HEAD(path string, handle httprouter.Handle) {
	i.Handle(http.MethodHead, path, handle)
}

//OPTIONS ...
func (i *IRouter) OPTIONS(path string, handle httprouter.Handle) {
	i.Handle(http.MethodOptions, path, handle)
}

//POST ...
func (i *IRouter) POST(path string, handle httprouter.Handle) {
	i.Handle(http.MethodPost, path, handle)
}

//PUT ...
func (i *IRouter) PUT(path string, handle httprouter.Handle) {
	i.Handle(http.MethodPut, path, handle)
}

//PATCH ...
func (i *IRouter) PATCH(path string, handle httprouter.Handle) {
	i.Handle(http.MethodPatch, path, handle)
}

//DELETE ...
func (i *IRouter) DELETE(path string, handle httprouter.Handle) {
	i.Handle(http.MethodDelete, path, handle)
}

// Handler ...
func (i *IRouter) Handler(method, path string, handler http.Handler) {
	handle := func(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
		handler.ServeHTTP(w, r)
	}
	i.Handle(method, path, handle)
}

// HandlerFunc ...
func (i *IRouter) HandlerFunc(method, path string, handle http.HandlerFunc) {
	i.Handler(method, path, handle)
}

//Static 值得考虑
func (i *IRouter) Static(path, root string) {
	h := http.StripPrefix(path, http.FileServer(http.Dir(root)))
	i.Handler(http.MethodGet, path, h)
}

//File ...
func (i *IRouter) File(path, name string) {
	i.HandlerFunc(http.MethodGet, path, func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, name)
	})
}

//ServeHTTP
func (i *IRouter) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	i.router.ServeHTTP(w, r)
}
