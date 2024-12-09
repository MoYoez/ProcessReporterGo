package win32

import (
	"syscall"
	"unsafe"

	"github.com/MoYoez/ProcessReporterGo/core/process"
)

var ForeGroundCaller *syscall.LazyProc

var GetWindowHeadLineText *syscall.LazyProc
var GetWindowThreadProcessID *syscall.LazyProc

var ProcessID uintptr
var WindowTitle [256]uint16

func init() {
	ForeGroundCaller = syscall.NewLazyDLL("user32.dll").NewProc("GetForegroundWindow")
	GetWindowThreadProcessID = syscall.NewLazyDLL("user32.dll").NewProc("GetWindowThreadProcessId")
	GetWindowHeadLineText = syscall.NewLazyDLL("user32.dll").NewProc("GetWindowTextW")
}

func GetHWND() (HWND uintptr, errorBool bool) {
	HWND, err, _ := ForeGroundCaller.Call()
	if err != 0 {
		errorBool = true
	}
	return HWND, errorBool
}

// GetForegroundWindowID Windows Platform Only.
func GetForegroundWindowID() (CallerID uintptr, errorBool bool) {
	getHWND, errorBool := GetHWND()
	if errorBool {
		return 0, true
	}
	GetWindowThreadProcessID.Call(getHWND, uintptr(unsafe.Pointer(&ProcessID)))
	return ProcessID, errorBool
}

func GetForegroundWindowApplicationName() (CallerName string, errorBool bool) {
	CallerID, errorBool := GetForegroundWindowID()
	if errorBool {
		return "", true
	}
	CallerName, _ = process.GetProcessApplicationName(CallerID)
	return CallerName, false
}

func GetWindowTitle(id uintptr) (string, bool) {
	GetWindowHeadLineText.Call(id, uintptr(unsafe.Pointer(&WindowTitle)), uintptr(len(WindowTitle)))
	return syscall.UTF16ToString(WindowTitle[:]), false
}
