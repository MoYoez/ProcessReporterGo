package x11

// REQUIRE XPROP => ( X11 ONLY )

// maybe I need to install ubuntu desktop when i have time to do this, btw I prefer to use wsl rather than VMWARE. (

/*
func XPropsForActiveWindow() {
	cmd := exec.Command("sh", "-c", "xprop -root | grep _NET_ACTIVE_WINDOW")
	var out bytes.Buffer
	cmd.Stdout = &out

	err := cmd.Run()
	if err != nil {
		fmt.Println("Error executing command:", err)
		return
	}
	getOutPut := out.String()
}
*/
