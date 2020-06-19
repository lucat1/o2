package main

import (
	"encoding/json"
	"net/http"

	"github.com/kataras/muxie"
)

// Response is a struct holding all the resposne information from an API request
type Response struct {
	Status int
	Error  string
	Data   interface{}
}

// HandlerFunc is an api handler which must return an API Response
type HandlerFunc = func(args map[string]string) Response

// Handler is a wrapper arround an api.HandlerFunc for standard HTTP routing
func Handler(f HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// compose the `args` argument
		args := map[string]string{}
		params := muxie.GetParams(w)
		for _, param := range params {
			args[param.Key] = param.Value
		}

		response := f(args)
		// set the HTTP status code if provided
		if response.Status != 0 {
			w.WriteHeader(response.Status)
		}

		obj := map[string]interface{}{
			"error": response.Error,
			"data":  response.Data,
		}
		data, err := json.Marshal(obj)
		if err != nil {

		}
		w.Write()
	}
}
