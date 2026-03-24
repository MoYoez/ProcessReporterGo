//go:build darwin

package caller

import (
	"github.com/MoYoez/ProcessReporterGo/core/request"
	"github.com/MoYoez/ProcessReporterGo/tools/darwin"
	"github.com/MoYoez/ProcessReporterGo/types"
	"github.com/charmbracelet/log"
	"time"
)

// MacOSRespPacked runs the reporter loop on macOS: periodically gets the
// frontmost application name via AppKit and sends it to the server.
func MacOSRespPacked(config *types.ConfigSets) {
	Ticker := time.NewTicker(time.Second * (time.Duration(config.SendReportTime)))
	defer Ticker.Stop()
	log.Infof("\nSetting: \nServer Endpoint: %s\nServer Key : %s\nTicket Pre Request Time: %d", config.ServerHost, config.ServerKey, config.SendReportTime)
	for range Ticker.C {
		GetCallerName, err := darwin.GetForegroundApplicationName()
		if err {
			log.Error("Cannot read frontmost app status")
			return
		}
		request.SendRequest(request.RequestStruct{
			Url:         config.ServerHost,
			ProcessName: GetCallerName,
			Key:         config.ServerKey,
			Debug:       config.Debug,
		})
	}
}
