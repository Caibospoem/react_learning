package task

import (
	"errors"
	"sync"
	"sync/atomic"
	"time"
)

type Service struct {
	mu      sync.RWMutex
	counter int64
	tasks   map[int64]*Task
	queue   chan int64
}

func NewService(queueSize int) *Service {
	s := &Service{
		tasks: make(map[int64]*Task),
		queue: make(chan int64, queueSize),
	}
	go s.worker()
	return s
}

func (s *Service) CreateTask(projectID int64, taskType string) *Task {
	id := atomic.AddInt64(&s.counter, 1)
	now := time.Now()

	t := &Task{
		ID:        id,
		ProjectID: projectID,
		Type:      taskType,
		Status:    StatusQueued,
		Progress:  0,
		CreatedAt: now,
		UpdatedAt: now,
	}

	s.mu.Lock()
	s.tasks[id] = t
	s.mu.Unlock()

	s.queue <- id
	return t
}

func (s *Service) ListTasks() []*Task {
	s.mu.RLock()
	defer s.mu.RUnlock()

	out := make([]*Task, 0, len(s.tasks))
	for _, t := range s.tasks {
		out = append(out, t)
	}
	return out
}

func (s *Service) GetTask(id int64) (*Task, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	t, ok := s.tasks[id]
	if !ok {
		return nil, errors.New("task not found")
	}
	return t, nil
}

func (s *Service) worker() {
	for id := range s.queue {
		s.update(id, StatusRunning, 25, "", "")
		time.Sleep(800 * time.Millisecond)

		s.update(id, StatusRunning, 60, "", "")
		time.Sleep(800 * time.Millisecond)

		result := `{"message":"task finished","artifact":"mock-output.json"}`
		s.update(id, StatusSuccess, 100, result, "")
	}
}

func (s *Service) update(id int64, status Status, progress int, result, errMsg string) {
	s.mu.Lock()
	defer s.mu.Unlock()

	t, ok := s.tasks[id]
	if !ok {
		return
	}

	t.Status = status
	t.Progress = progress
	t.Result = result
	t.Error = errMsg
	t.UpdatedAt = time.Now()
}
