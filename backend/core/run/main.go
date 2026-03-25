package run

import (
	"os"
	"strconv"
	"strings"

	"github.com/MoYoez/ProcessReporterGo/core/caller"
	"github.com/MoYoez/ProcessReporterGo/core/define"
	"github.com/MoYoez/ProcessReporterGo/types"
	"github.com/charmbracelet/log"
	"github.com/joho/godotenv"
)

var DefaultConfigSets = types.ConfigSets{}

func init() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
		return
	}
	// check config sets.
	DefaultConfigSets = types.ConfigSets{
		ServerHost:     "",
		ServerKey:      "",
		SendReportTime: 30,
	}
	debugEnv := strings.TrimSpace(strings.ToLower(os.Getenv("DEBUG")))
	DefaultConfigSets.Debug = debugEnv == "1" || debugEnv == "true" || debugEnv == "yes"

	DefaultConfigSets.ServerHost = os.Getenv("SERVER_HOST")
	if DefaultConfigSets.ServerHost == "" && !DefaultConfigSets.Debug {
		log.Fatal("ServerHost Is Empty :( ")
		return
	}
	DefaultConfigSets.ServerKey = os.Getenv("SERVER_KEY")
	ToInt, err := strconv.ParseInt(os.Getenv("SEND_REPORT_TIME"), 10, 64)
	if err != nil {
		ToInt = 5
	}
	// pre check data
	DefaultConfigSets.SendReportTime = ToInt

	if DefaultConfigSets.Debug {
		log.Info("debug mode enabled: reports are printed only, no HTTP POST")
	}

}

func RunService() {
	GetService := define.SystemChecking()
	switch {
	case GetService == define.Windows:
		caller.WindowsRespPacked(&DefaultConfigSets)
	case GetService == define.Linux:
		panic("Not Support Yet.")
	case GetService == define.MacOS:
		caller.MacOSRespPacked(&DefaultConfigSets)
	case GetService == define.Unknown:
		panic("This Is unknown System (Unknown Type). ")
	}
}
