package slug

import "testing"

func TestNormalize(t *testing.T) {
	tests := []struct {
		name  string
		input string
		want  string
	}{
		{name: "basic words", input: "AI Game Platform", want: "ai-game-platform"},
		{name: "with spaces", input: "  My Demo Project  ", want: "my-demo-project"},
		{name: "with symbols", input: "Map@Editor#V1!", want: "map-editor-v1"},
		{name: "with underscore", input: "build_task_service", want: "build-task-service"},
		{name: "empty input", input: "   ", want: "untitled-project"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := Normalize(tt.input)
			if got != tt.want {
				t.Fatalf("Normalize(%q)=%q, want=%q", tt.input, got, tt.want)
			}
		})
	}
}
