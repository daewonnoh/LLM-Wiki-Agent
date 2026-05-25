import os
import subprocess
import sys

base_dir = r"C:\Users\naisd\AppData\Local\GitHubDesktop"
git_exe = None

if os.path.exists(base_dir):
    for root, dirs, files in os.walk(base_dir):
        if "git.exe" in files:
            path = os.path.join(root, "git.exe")
            if "cmd" in root:
                git_exe = path
                break
            git_exe = path

if not git_exe:
    print("ERROR: git.exe not found")
    sys.exit(1)

cwd = r"C:\Users\naisd\.gemini\antigravity\scratch\literature-research-web"

def run_git(args):
    res = subprocess.run([git_exe] + args, cwd=cwd, capture_output=True, text=True)
    print(f"Git {' '.join(args)}: {res.returncode}")
    if res.stdout:
        print("STDOUT:", res.stdout)
    if res.stderr:
        print("STDERR:", res.stderr)

run_git(["add", "."])
run_git(["commit", "-m", "Integrate critique-prism v2.0 detailed report to cognition tab in novel reader"])
run_git(["push"])
print("SUCCESS")
