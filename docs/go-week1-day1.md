# Go Week1 Day1 Checklist

## Goal
Complete Go environment check and finish first CLI exercise (`slugger`).

## Tasks
1. Install Go and verify:
```bash
go version
go env
```
2. Run Go task service locally:
```bash
cd E:\project\re\game_admin_go_task
go run ./cmd/server
```
3. Run slug CLI:
```bash
go run ./cmd/slugger "AI Game Platform"
```
Expected output:
```text
ai-game-platform
```
4. Run unit tests:
```bash
go test ./...
```

## Daily Deliverables
1. One screenshot of `go version`.
2. One screenshot of slugger output.
3. One screenshot of `go test ./...` passing.
4. A short note:
   - What felt different vs Python?
   - What was confusing today?

## Day1 Interview Q&A (prepare 3)
1. Why does Go encourage small packages and explicit imports?
2. Why return `value, err` instead of exceptions?
3. What problem does a Go module (`go.mod`) solve?
