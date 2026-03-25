//go:build windows

package caller

import (
	"time"

	"github.com/MoYoez/ProcessReporterGo/core/request"
	"github.com/MoYoez/ProcessReporterGo/tools/win32"
	"github.com/MoYoez/ProcessReporterGo/types"
	"github.com/charmbracelet/log"
)

func WindowsRespPacked(config *types.ConfigSets) {
	Ticker := time.NewTicker(time.Second * (time.Duration(config.SendReportTime)))
	defer Ticker.Stop()
	// Ticket Start.
	log.Debugf("\nSetting: \nServer Endpoint: %s\nServer Key : %s\nTicket Pre Request Time: %d", config.ServerHost, config.ServerKey, config.SendReportTime)
	for range Ticker.C {
		GetCallerName, err := win32.GetForegroundWindowApplicationName()
		if err {
			log.Error("Cannot read ForeGround Windows Status")
			return
		}
		winTitle, titleErr := win32.GetForegroundWindowTitle()
		if titleErr {
			winTitle = ""
		}
		request.SendRequest(request.RequestStruct{
			Url:         config.ServerHost,
			ProcessName: GetCallerName,
			Title:       winTitle,
			Key:         config.ServerKey,
			Debug:       config.Debug,
		})
	}
}
