//go:build !darwin

package caller

import "github.com/MoYoez/ProcessReporterGo/types"

// MacOSRespPacked is a stub for non-darwin builds so that caller.MacOSRespPacked
// exists at link time. It should not be called when running on non-darwin.
func MacOSRespPacked(_ *types.ConfigSets) {
	panic("Not Support Yet.")
}
