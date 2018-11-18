package responses

import (
	"encoding/json"
	"io"
	"net/http"
)

//Err error message
type Err struct {
	Error     string `json:"error"`
	ErrorCode string `json:"error_code"`
	ErrorMsg  string `json:"error_msg"`
}

// ErrorResponse error response body
type ErrorResponse struct {
	StatusCode int `json:"status_code"`
	Error      Err
}

var (
	// ErrorRequestBodyParseFailed 解析请求body失败
	ErrorRequestBodyParseFailed = ErrorResponse{StatusCode: http.StatusBadGateway, Error: Err{Error: "Request Body is not correct", ErrorMsg: "解析请求体失败", ErrorCode: "0001"}}
)

//SendErrorResonse 返回错误处理
func SendErrorResonse(w http.ResponseWriter, e ErrorResponse) {
	w.WriteHeader(e.StatusCode)
	d, _ := json.Marshal(e.Error)
	io.WriteString(w, string(d))
}

//SendOkResponse 返回成功处理
func SendOkResponse(w http.ResponseWriter, msg string, statusCode int) {
	w.WriteHeader(statusCode)
	io.WriteString(w, msg)
}
