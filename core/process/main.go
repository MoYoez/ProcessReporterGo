package process

import (
	"github.com/shirou/gopsutil/v3/process"
)

func GetProcessById(id uintptr) *process.Process {
	return &process.Process{Pid: int32(id)}
}

func GetProcessApplicationName(id uintptr) (string, error) {
	processMain := GetProcessById(id)
	name, err := processMain.Name()
	if err != nil {
		return "", err
	}
	return name, nil
}
