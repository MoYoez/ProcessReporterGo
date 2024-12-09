package define

import (
	"runtime"
)

type SystemDefine string

const (
	Windows SystemDefine = "windows"
	Linux   SystemDefine = "linux"
	MacOS   SystemDefine = "macos"
	Unknown SystemDefine = "unknown"
)

// SystemChecking Define SYSTEM E.G: Windows / Linux / Macos (Darwin)
func SystemChecking() SystemDefine {
	switch {
	case runtime.GOOS == "windows":
		return Windows
	case runtime.GOOS == "linux":
		return Linux
	case runtime.GOOS == "darwin":
		return MacOS
	default:
		return Unknown
	}
}
