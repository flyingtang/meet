package config

import (
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
	"io"
	"io/ioutil"
)



type Config struct {
	HttpAddr    string
	HttpPort    string
	JwtSecret   string
	Version string
}



// 这里会导致不好测试
//func init() {
//	GlobalConfig = getConfig()
//	// TODO 自动解析json文件
//}

var defaultConf *Config


func New() (*Config) {
	if defaultConf == nil {
		defaultConf = getConfig()
	}
	return defaultConf
}

func GetCong()(*Config){
	if defaultConf == nil {
		defaultConf = getConfig()
	}
	return defaultConf
}

func getPath() (filePath string) {

	const dir = "conf/json"
	m := gin.Mode()

	if m == gin.DebugMode {
		filePath = fmt.Sprintf("%s/%s.config.json", dir, "dev")
	} else if m == gin.ReleaseMode {
		filePath = fmt.Sprintf("%s/%s.config.json", dir, "pro")
	} else if m == gin.TestMode {
		filePath = fmt.Sprintf("%s/%s.config.json", dir, "test")
	}
	return
}

// 初始化时获取Config对象
func getConfig() *Config {
	var c Config
	configFilePath := getPath()
	if len(configFilePath) == 0 {
		panic("can't get config path")
	}
	data, err := ioutil.ReadFile(configFilePath)
	if err != nil && err != io.EOF {
		log.Fatal("read config file error ", err.Error())
	}

	err = json.Unmarshal(data, &c)
	if err != nil {
		log.Fatal("transform config filr error ", err.Error())
	}
	return &c
}

// 获取http监听地址和端口URL
func (config *Config) GetListenAddr() string {
	if len(config.HttpAddr) == 0 {
		config.HttpAddr = ""
		log.Warnf("set default server host/ip is %s", config.HttpAddr)
	}

	if len(config.HttpPort) == 0 {
		config.HttpPort = "3000"
		log.Warnf("set default server port is %s", config.HttpPort)
	}
	ap := config.HttpAddr + ":" + config.HttpPort
	return ap
}


