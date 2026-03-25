//go:build !windows

package caller

import "github.com/MoYoez/ProcessReporterGo/types"

// WindowsRespPacked is a stub for non-Windows builds so that caller.WindowsRespPacked
// exists at link time. It should not be called when running on non-Windows.
func WindowsRespPacked(_ *types.ConfigSets) {
	panic("Not Support Yet.")
}
