package middlewares

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/julienschmidt/httprouter"
)

var (
	green        = string([]byte{27, 91, 57, 55, 59, 52, 50, 109})
	white        = string([]byte{27, 91, 57, 48, 59, 52, 55, 109})
	yellow       = string([]byte{27, 91, 57, 48, 59, 52, 51, 109})
	red          = string([]byte{27, 91, 57, 55, 59, 52, 49, 109})
	blue         = string([]byte{27, 91, 57, 55, 59, 52, 52, 109})
	magenta      = string([]byte{27, 91, 57, 55, 59, 52, 53, 109})
	cyan         = string([]byte{27, 91, 57, 55, 59, 52, 54, 109})
	reset        = string([]byte{27, 91, 48, 109})
	disableColor = false
)

//type AuthMiddleWare struct {
//	r *httprouter.Router
//}
//
//func (a AuthMiddleWare) ServeHTTP(w http.ResponseWriter, r *http.Request) {
//	// check
//
//	a.r.ServeHTTP(w, r)
//}
//
//func NewAuthMiddleWare(r *httprouter.Router) http.Handler {
//	a := AuthMiddleWare{}
//	a.r = r
//	return a
//}

//Log 日志
func Log(next httprouter.Handle) httprouter.Handle {
	isTerm := true

	return func(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
		start := time.Now()
		path := r.URL.Path
		next(w, r, ps)

		end := time.Now()
		latency := end.Sub(start)
		method := r.Method
		//w.WriteHeader()
		s := w.Header().Get("StatusCode")
		//s1 := w.Status()
		fmt.Println(s)
		fmt.Println(s)

		statusCode := 200
		var statusColor, methodColor, resetColor string
		if isTerm {
			statusColor = colorForStatus(statusCode)
			methodColor = colorForMethod(method)
			resetColor = reset
		}
		fmt.Fprintf(os.Stdout, "api %v | %s %3d %s| %13v|%15s|%s %-7s %s %s\n%s",
			end.Format("2006/01/02 - 15:04:05"),
			statusColor, statusCode, resetColor,
			latency,
			"127.0.0.1",
			methodColor, method, resetColor,
			path,
		)
	}
}

func colorForStatus(code int) string {
	switch {
	case code >= http.StatusOK && code < http.StatusMultipleChoices:
		return green
	case code >= http.StatusMultipleChoices && code < http.StatusBadRequest:
		return white
	case code >= http.StatusBadRequest && code < http.StatusInternalServerError:
		return yellow
	default:
		return red
	}
}

func colorForMethod(method string) string {
	switch method {
	case "GET":
		return blue
	case "POST":
		return cyan
	case "PUT":
		return yellow
	case "DELETE":
		return red
	case "PATCH":
		return green
	case "HEAD":
		return magenta
	case "OPTIONS":
		return white
	default:
		return reset
	}
}

//Auth 认证中间件
func Auth(next httprouter.Handle) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
		fmt.Println("认证")
		next(w, r, ps)
	}
}
