## ProcessReporterGO

A Go implementation of [ProcessReporter](https://github.com/mx-space/ProcessReporterMac).

ProcessReporter 是一个 为 [Shiro](https://github.com/Innei/Shiro) 主题做的一个简单的上报工具，然后将其可以在用户的主题上显示。

## Installation

See [Release](https://github.com/MoYoez/ProcessReporterGo/releases) 

## Build

```Shell
go build -ldflags "-s -w"
```


## Requirement

- A computer which can play minesweeper and not too old (.

## Config

```Shell
> touch .env
```

```PowerShell
> powershell New-Item -ItemType File .env
```

```Config(Example)
SERVER_HOST = http://114.5.1.4:2333/api/v2/fn/ps/update
SERVER_KEY = 1145141919180
SEND_REPORT_TIME = 30
```


### TODO

- Linux Distro Support ~~and MacOS Support~~

- Media Now Playing Support.

