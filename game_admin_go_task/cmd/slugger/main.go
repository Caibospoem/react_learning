package main

import (
	"fmt"
	"os"
	"strings"

	"game_admin_go_task/internal/slug"
)

func main() {
	if len(os.Args) < 2 {
		fmt.Println("usage: slugger <project name>")
		os.Exit(1)
	}

	input := strings.Join(os.Args[1:], " ")
	fmt.Println(slug.Normalize(input))
}
