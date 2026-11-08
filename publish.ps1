param(
  [Parameter(Mandatory = $true)]
  [string]$RepoUrl,
  [string]$Branch = "main",
  [string]$Message = "Sitio JSB SpA"
)

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  Write-Error "Git no está instalado. Instala Git for Windows o usa GitHub Desktop."
  exit 1
}

if (-not (Test-Path ".git")) {
  git init -b $Branch
}

git add .
git commit -m $Message
git branch -M $Branch

$existing = git remote get-url origin 2>$null
if ($LASTEXITCODE -eq 0) {
  git remote set-url origin $RepoUrl
} else {
  git remote add origin $RepoUrl
}

git push -u origin $Branch
