package caller

import (
	"github.com/MoYoez/ProcessReporterGo/core/request"
	"github.com/MoYoez/ProcessReporterGo/tools/win32"
	"github.com/MoYoez/ProcessReporterGo/types"
	"github.com/charmbracelet/log"
	"time"
)

func WindowsRespPacked(config *types.ConfigSets) {
	Ticker := time.NewTicker(time.Second * (time.Duration(config.SendReportTime)))
	defer Ticker.Stop()
	// Ticket Start.
	log.Infof("\nSetting: \nServer Endpoint: %s\nServer Key : %s\nTicket Pre Request Time: %d", config.ServerHost, config.ServerKey, config.SendReportTime)
	for {
		select {
		case <-Ticker.C:
			GetCallerName, err := win32.GetForegroundWindowApplicationName()
			if err {
				log.Error("Cannot read ForeGround Windows Status")
				return
			}
			// transform.
			request.SendRequest(request.RequestStruct{
				Url:         config.ServerHost,
				ProcessName: GetCallerName,
				Key:         config.ServerKey,
			})
		}
	}
}
