package main

import (
	"github.com/gin-gonic/gin"
	"meet/gateway/config"
	"vinda-api/controllers"
	"vinda-api/controllers/accounts"
	"vinda-api/controllers/articles"
	"vinda-api/controllers/categories"

	"meet/gateway/middlewares"
)




func main() {

	baseRouter := gin.New()
	c := config.New()

	baseRouter.Use(middlewares.Pre)
	version := config.GetCong().Version
	v := baseRouter.Group(version)
	{
		v.POST("/account/login", accounts.Login)
		v.POST("/account/signup", accounts.Signup)

		v.GET("/article", articles.Find)
		v.GET("/article/:id", articles.FindOne)
		v.GET("/category", categories.Find)
	}

	// 认证
	authv := baseRouter.Group(version, controllers.Auth)

	{
		authv.POST("/upload", controllers.Upload)

		authv.POST("/article", articles.Create)

		authv.DELETE("/article/:id", articles.Delete)
		authv.PATCH("/article/:id", articles.Patch)
		authv.DELETE("/article", articles.DeleteAll)

		authv.POST("/category", categories.Create)

		authv.DELETE("/category", categories.DeleteAll)
		authv.DELETE("/category/:id", categories.Delete)
		authv.PATCH("/category/:id", categories.Patch)

		// 获取用户信息
		authv.GET("/account/me", accounts.Me)
	}

	// 预处理
	// 认证

	// 鉴权

	// 限流

	// 转发
	addr := c.GetListenAddr()
	baseRouter.Run(addr)
}
