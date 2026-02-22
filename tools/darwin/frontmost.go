//go:build darwin

package darwin

/*
#cgo CFLAGS: -x objective-c
#cgo LDFLAGS: -framework AppKit -framework Foundation
#import <Cocoa/Cocoa.h>
#import <stdlib.h>

// getFrontmostAppName returns the localized name of the frontmost application.
// Caller must free the returned pointer with C.free.
char* getFrontmostAppName(void) {
	NSRunningApplication *app = [[NSWorkspace sharedWorkspace] frontmostApplication];
	if (!app) return NULL;
	NSString *name = [app localizedName];
	if (!name) return NULL;
	const char *utf8 = [name UTF8String];
	if (!utf8) return NULL;
	return strdup(utf8);
}
*/
import "C"

import (
	"unsafe"
)

// GetForegroundApplicationName returns the name of the frontmost application on macOS.
// It uses NSWorkspace sharedWorkspace frontmostApplication (CGO + AppKit).
// Returns (name, false) on success, ("", true) on failure.
func GetForegroundApplicationName() (string, bool) {
	cstr := C.getFrontmostAppName()
	if cstr == nil {
		return "", true
	}
	defer C.free(unsafe.Pointer(cstr))
	return C.GoString(cstr), false
}
