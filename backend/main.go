package main

import (
	"runtime"

	"github.com/MoYoez/ProcessReporterGo/core/run"
)

func main() {
	// Pin main goroutine to main thread so AppKit/NSWorkspace sees up-to-date frontmost app on macOS.
	runtime.LockOSThread()
	run.RunService()
}
