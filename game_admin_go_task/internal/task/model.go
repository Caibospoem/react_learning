package task

import "time"

type Status string

const (
	StatusQueued  Status = "queued"
	StatusRunning Status = "running"
	StatusSuccess Status = "success"
	StatusFailed  Status = "failed"
)

type Task struct {
	ID        int64     `json:"id"`
	ProjectID int64     `json:"project_id"`
	Type      string    `json:"type"`
	Status    Status    `json:"status"`
	Progress  int       `json:"progress"`
	Result    string    `json:"result,omitempty"`
	Error     string    `json:"error,omitempty"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
