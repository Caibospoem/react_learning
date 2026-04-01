FROM golang:1.22-alpine AS build

WORKDIR /src

COPY go.mod ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /out/game_admin_go_task ./cmd/server

FROM alpine:3.20

WORKDIR /app
COPY --from=build /out/game_admin_go_task /app/game_admin_go_task

EXPOSE 8081

CMD ["/app/game_admin_go_task"]
