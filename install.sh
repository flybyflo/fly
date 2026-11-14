#!/usr/bin/env bash
# Links fly skills into the Codex and Claude Code skill folders, its agents
# into Claude Code, and fly-models.md to ~/.agents/fly-models.md. Existing
# entries that do not point at this repo are left alone and reported. Run with
# --uninstall to remove only this repo's links.
set -euo pipefail

repo="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
skill_targets=("$HOME/.agents/skills" "$HOME/.claude/skills")
agent_target="$HOME/.claude/agents"
mode="${1:-install}"

case "$mode" in
  install | --uninstall) ;;
  -h | --help)
    echo "usage: ./install.sh [--uninstall]"
    exit 0
    ;;
  *)
    echo "unknown argument: $mode" >&2
    echo "usage: ./install.sh [--uninstall]" >&2
    exit 2
    ;;
esac

points_into_repo() {
  [[ -L "$1" ]] && [[ "$(readlink "$1")" == "$repo/"* ]]
}

link() {
  local source="$1" destination="$2"
  if points_into_repo "$destination"; then
    ln -sfn "$source" "$destination"
  elif [[ -e "$destination" || -L "$destination" ]]; then
    echo "skip  $destination (exists, not managed by fly)"
  else
    ln -s "$source" "$destination"
    echo "link  $destination"
  fi
}

unlink_managed() {
  local destination="$1"
  if points_into_repo "$destination"; then
    rm "$destination"
    echo "unlink $destination"
  fi
}

prune_stale() {
  local entry
  for entry in "$1"/*; do
    if points_into_repo "$entry" && [[ ! -e "$entry" ]]; then
      rm "$entry"
      echo "prune $entry"
    fi
  done
}

for target in "${skill_targets[@]}"; do
  [[ "$mode" == "--uninstall" ]] || mkdir -p "$target"
  prune_stale "$target"
  for skill in "$repo"/skills/*/; do
    name="$(basename "$skill")"
    if [[ "$mode" == "--uninstall" ]]; then
      unlink_managed "$target/$name"
    else
      link "${skill%/}" "$target/$name"
    fi
  done
done

models_link="$HOME/.agents/fly-models.md"
if [[ "$mode" == "--uninstall" ]]; then
  unlink_managed "$models_link"
else
  link "$repo/fly-models.md" "$models_link"
fi

[[ "$mode" == "--uninstall" ]] || mkdir -p "$agent_target"
prune_stale "$agent_target"
for agent in "$repo"/agents/*.md; do
  name="$(basename "$agent")"
  if [[ "$mode" == "--uninstall" ]]; then
    unlink_managed "$agent_target/$name"
  else
    link "$agent" "$agent_target/$name"
  fi
done

if [[ "$mode" != "--uninstall" ]]; then
  echo "done. Start a new Claude Code or Codex thread, then run /setup-fly."
fi
