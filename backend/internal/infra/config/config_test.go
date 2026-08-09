package config

import "testing"

func TestLoadUsesDefaultPortWhenUnset(t *testing.T) {
	t.Setenv("PORT", "")
	t.Setenv("MYSQL_DSN", "")

	cfg := Load()

	if got, want := cfg.Port, defaultPort; got != want {
		t.Errorf("Port: got %q, want %q", got, want)
	}
	if got := cfg.MySQLDSN; got != "" {
		t.Errorf("MySQLDSN: got %q, want 空文字", got)
	}
}

func TestLoadReadsEnv(t *testing.T) {
	const dsn = "u:p@tcp(127.0.0.1:3306)/selfsketch?parseTime=true&loc=UTC"
	t.Setenv("PORT", "9090")
	t.Setenv("MYSQL_DSN", dsn)

	cfg := Load()

	if got, want := cfg.Port, "9090"; got != want {
		t.Errorf("Port: got %q, want %q", got, want)
	}
	if got, want := cfg.MySQLDSN, dsn; got != want {
		t.Errorf("MySQLDSN: got %q, want %q", got, want)
	}
}
