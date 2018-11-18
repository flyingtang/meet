package middlewares

import (
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
	"meet/gateway/config"
	"meet/gateway/responses"
	"strings"
)

var (
	platforms = []string{"Android", "iPhone"}
)

// Pre 预处理
func Pre(c *gin.Context) {
	// 设置平台
	setPlatform(c)

}

//setPlatform 设置平台
func setPlatform(c *gin.Context)  {
	platform := c.Param("platform")
	if len(platform) == 0 {
		agent := c.GetHeader("User-Agent")
		for i := 0; i <  len(platforms); i++ {
			if strings.Index(agent, platforms[i]) > -1 {
				platform = "mobile"
			}
		}
	}
	c.Set("platform", platform)
}


//Authentication 认证
func Authentication(c *gin.Context)  {
	var tokenString string
	tokenString = c.GetHeader("authentication")
	if len(tokenString) == 0 || tokenString == "undefined" {
		tokenString = c.Query("authentication")
		if len(tokenString) == 0 || tokenString == "undefined" {
			logrus.Errorf("%s\n", "未登录")
			responses.SendErrorResponse(c, responses.ErrorNotAuthentication)
			return
		}
	}
	jwtSecret := config.GetCong().JwtSecret
	if len(jwtSecret) == 0 {
		responses.SendErrorResponse(c, responses.ErrorInternalServer)
		return
	}

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}

		return []byte(jwtSecret), nil
	})

	if err != nil {
		logrus.Errorf("jwt.Parse err %s", err.Error())
		responses.SendErrorResponse(c, responses.ErrorInternalServer)
		return
	}
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {

		c.Set("user", map[string]interface{}{
			"userId":   claims["userId"],
			"username": claims["username"],
		})
	} else {
		logrus.Errorf("token.Claims err %s", err.Error())
		responses.SendErrorResponse(c, responses.ErrorInternalServer)
		return
	}
}