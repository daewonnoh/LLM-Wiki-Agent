import os
import glob
import sys
import subprocess
from datetime import datetime

def find_git_path():
    # 1. 일반적인 시스템 PATH에서 git 찾기 시도
    try:
        result = subprocess.run(["git", "--version"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        if result.returncode == 0:
            return "git" # PATH에 이미 있음
    except FileNotFoundError:
        pass

    # 2. GitHub Desktop 경로 탐색
    user_profile = os.environ.get("USERPROFILE", "C:\\Users\\user")
    gh_desktop_path = os.path.join(user_profile, "AppData", "Local", "GitHubDesktop")
    
    if os.path.exists(gh_desktop_path):
        # app-* 폴더들을 찾음
        app_pattern = os.path.join(gh_desktop_path, "app-*")
        app_folders = glob.glob(app_pattern)
        # 버전이 가장 높은 것을 찾기 위해 정렬
        app_folders.sort(reverse=True)
        
        for folder in app_folders:
            git_exe = os.path.join(folder, "resources", "app", "git", "cmd", "git.exe")
            if os.path.exists(git_exe):
                return git_exe
                
    # 3. 다른 일반적인 설치 경로
    common_paths = [
        "C:\\Program Files\\Git\\cmd\\git.exe",
        "C:\\Program Files (x86)\\Git\\cmd\\git.exe"
    ]
    for path in common_paths:
        if os.path.exists(path):
            return path
            
    return None

def main():
    git_path = find_git_path()
    if not git_path:
        print("Error: Git executable could not be found.")
        sys.exit(1)
        
    print(f"Using Git path: {git_path}")
    
    # 커밋 메시지 구성
    commit_msg = "LLM Wiki Auto Update"
    if len(sys.argv) > 1:
        commit_msg = sys.argv[1]
    else:
        commit_msg += f" - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
        
    # Git 명령어 실행
    try:
        print("Executing: git add .")
        subprocess.run([git_path, "add", "."], check=True)
        
        print(f"Executing: git commit -m \"{commit_msg}\"")
        subprocess.run([git_path, "commit", "-m", commit_msg], check=True)
        
        print("Executing: git push")
        subprocess.run([git_path, "push"], check=True)
        
        print("Successfully committed and pushed to GitHub!")
    except subprocess.CalledProcessError as e:
        print(f"Git command failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
