package run

import (
	"github.com/MoYoez/ProcessReporterGo/core/caller"
	"github.com/MoYoez/ProcessReporterGo/core/define"
	"github.com/MoYoez/ProcessReporterGo/types"
	"github.com/joho/godotenv"
	"log"
	"os"
	"strconv"
)

var DefaultConfigSets = types.ConfigSets{}

func init() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	// check config sets.
	DefaultConfigSets = types.ConfigSets{
		ServerHost:     "",
		ServerKey:      "",
		SendReportTime: 30,
	}
	DefaultConfigSets.ServerHost = os.Getenv("SERVER_HOST")
	if DefaultConfigSets.ServerHost == "" {
		panic("NOT ENOUGH CONFIG")
	}
	DefaultConfigSets.ServerKey = os.Getenv("SERVER_KEY")
	ToInt, err := strconv.ParseInt(os.Getenv("SEND_REPORT_TIME"), 10, 64)
	if err != nil {
		ToInt = 30
	}
	// pre check data
	DefaultConfigSets.SendReportTime = ToInt

}

func RunService() {
	GetService := define.SystemChecking()
	switch {
	case GetService == define.Windows:
		caller.WindowsRespPacked(&DefaultConfigSets)
	case GetService == define.Linux:
		panic("Not Support Yet.")
	case GetService == define.MacOS:
		panic("Not Support Yet.")
	case GetService == define.Unknown:
		panic("This Is unknown System (Unknown Type). ")
	}
}
