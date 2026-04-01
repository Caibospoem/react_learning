package main

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"strings"

	"game_admin_go_task/internal/task"
)

type createTaskRequest struct {
	ProjectID int64  `json:"project_id"`
	Type      string `json:"type"`
}

type apiResponse struct {
	Code    int         `json:"code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}

func main() {
	svc := task.NewService(100)
	mux := http.NewServeMux()

	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			writeJSON(w, http.StatusMethodNotAllowed, apiResponse{Code: 405, Message: "method not allowed"})
			return
		}
		writeJSON(w, http.StatusOK, apiResponse{
			Code:    0,
			Message: "ok",
			Data:    map[string]string{"service": "game_admin_go_task"},
		})
	})

	mux.HandleFunc("/tasks", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			writeJSON(w, http.StatusOK, apiResponse{Code: 0, Message: "ok", Data: svc.ListTasks()})
		case http.MethodPost:
			var req createTaskRequest
			if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
				writeJSON(w, http.StatusBadRequest, apiResponse{Code: 4001, Message: "invalid json body"})
				return
			}
			if req.Type == "" {
				writeJSON(w, http.StatusBadRequest, apiResponse{Code: 4002, Message: "type is required"})
				return
			}

			t := svc.CreateTask(req.ProjectID, req.Type)
			writeJSON(w, http.StatusCreated, apiResponse{Code: 0, Message: "created", Data: t})
		default:
			writeJSON(w, http.StatusMethodNotAllowed, apiResponse{Code: 405, Message: "method not allowed"})
		}
	})

	mux.HandleFunc("/tasks/", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			writeJSON(w, http.StatusMethodNotAllowed, apiResponse{Code: 405, Message: "method not allowed"})
			return
		}

		idText := strings.TrimPrefix(r.URL.Path, "/tasks/")
		id, err := strconv.ParseInt(idText, 10, 64)
		if err != nil {
			writeJSON(w, http.StatusBadRequest, apiResponse{Code: 4003, Message: "invalid task id"})
			return
		}

		t, err := svc.GetTask(id)
		if err != nil {
			writeJSON(w, http.StatusNotFound, apiResponse{Code: 4041, Message: "task not found"})
			return
		}

		writeJSON(w, http.StatusOK, apiResponse{Code: 0, Message: "ok", Data: t})
	})

	addr := ":8081"
	log.Printf("game_admin_go_task listening on %s\n", addr)
	if err := http.ListenAndServe(addr, mux); err != nil {
		log.Fatalf("server exited: %v", err)
	}
}

func writeJSON(w http.ResponseWriter, statusCode int, payload apiResponse) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	_ = json.NewEncoder(w).Encode(payload)
}
