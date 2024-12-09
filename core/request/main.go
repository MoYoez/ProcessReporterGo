package request

import (
	"bytes"
	"encoding/json"
	"github.com/MoYoez/ProcessReporterGo/tools/b2s"
	"github.com/charmbracelet/log"
	"io"
	"net/http"
	"strings"
	"time"
)

var RequestHttpClient http.Client

type RequestStruct struct {
	Url         string
	ProcessName string
	Key         string
}

type Media struct {
	Title  string `json:"title"`
	Artist string `json:"artist"`
}

type PackedStruct struct {
	Timestamp int64  `json:"timestamp"`
	Process   string `json:"process"`
	Key       string `json:"key"`
}

func SendRequest(RequestStruct RequestStruct) {
	// map struct Json Type.

	PackedStructBase := PackedStruct{
		Timestamp: time.Now().Unix(),
		Process:   ProcessReplacer(RequestStruct.ProcessName),
		Key:       RequestStruct.Key,
	}
	ToBytes, err := json.Marshal(&PackedStructBase)
	if err != nil {
		panic("This situation cannot be happened.")
	}
	NewRequester, err := http.NewRequest("POST", RequestStruct.Url, bytes.NewReader(ToBytes))
	NewRequester.Header.Set("Content-Type", "application/json")
	NewRequester.Header.Set("User-Agent", "ProcessReporterGo/0.1;HonkaiImpactNotResponse")
	ResponseData, err := RequestHttpClient.Do(NewRequester)
	if err != nil {
		log.Error("Send Request Error: ", err)
		return
	}
	GetIOBytes, err := io.ReadAll(ResponseData.Body)
	if err != nil {
		log.Error("Read Response Error: ", err)
		return
	}
	log.Info(b2s.BytesToString(GetIOBytes))

}

func ProcessReplacer(string2 string) string {
	return strings.ReplaceAll(string2, ".exe", "")
}
