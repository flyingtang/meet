package responses

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func SendErrorResponse(c *gin.Context, e ErrorResponse){
	c.AbortWithStatusJSON(e.StatusCode, e.Error)
}

type Err struct {
	ErrorMsg string `json:"error_msg"`
	ErrorCode string `json:"error_code"`
} 

type ErrorResponse struct {
	StatusCode int `json:"status_code"`
	Error Err
}


var  (
	ErrorNotAuthentication = ErrorResponse{StatusCode: http.StatusUnauthorized, Error: Err{"请登录", "0001"}}
	ErrorInternalServer = ErrorResponse{StatusCode: http.StatusInternalServerError,Error: Err{ErrorMsg: "服务器错误", ErrorCode:"0002"}}
)