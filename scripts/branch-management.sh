#!/bin/bash

# 🚀 Bonded Branch Management Script
# This script helps manage the branch workflow for the Bonded project

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  dev          - Switch to development (group) branch"
    echo "  prod         - Switch to production branch"
    echo "  main         - Switch to main branch"
    echo "  status       - Show current branch status"
    echo "  sync         - Sync all branches with remote"
    echo "  deploy       - Deploy production to remote"
    echo "  help         - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 dev       - Switch to development branch"
    echo "  $0 deploy    - Deploy production branch"
}

# Function to check if we're in a git repository
check_git_repo() {
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        print_error "Not in a git repository!"
        exit 1
    fi
}

# Function to switch to development branch
switch_to_dev() {
    print_status "Switching to development branch (group)..."
    git checkout group
    git pull origin group
    print_success "Switched to development branch"
    print_status "Current branch: $(git branch --show-current)"
}

# Function to switch to production branch
switch_to_prod() {
    print_status "Switching to production branch..."
    git checkout production
    git pull origin production
    print_success "Switched to production branch"
    print_status "Current branch: $(git branch --show-current)"
}

# Function to switch to main branch
switch_to_main() {
    print_status "Switching to main branch..."
    git checkout main
    git pull origin main
    print_success "Switched to main branch"
    print_status "Current branch: $(git branch --show-current)"
}

# Function to show branch status
show_status() {
    print_status "Current branch: $(git branch --show-current)"
    print_status "Repository status:"
    git status --short
    echo ""
    print_status "Recent commits:"
    git log --oneline -5
}

# Function to sync all branches
sync_branches() {
    print_status "Syncing all branches with remote..."
    
    # Sync main branch
    print_status "Syncing main branch..."
    git checkout main
    git pull origin main
    
    # Sync group branch
    print_status "Syncing group branch..."
    git checkout group
    git pull origin group
    
    # Sync production branch
    print_status "Syncing production branch..."
    git checkout production
    git pull origin production
    
    print_success "All branches synced successfully!"
}

# Function to deploy production
deploy_production() {
    print_status "Deploying production branch..."
    
    # Switch to production branch
    git checkout production
    git pull origin production
    
    # Push to trigger deployment
    git push origin production
    
    print_success "Production deployment triggered!"
    print_status "Check GitHub Actions for deployment status"
}

# Main script logic
main() {
    check_git_repo
    
    case "$1" in
        "dev")
            switch_to_dev
            ;;
        "prod")
            switch_to_prod
            ;;
        "main")
            switch_to_main
            ;;
        "status")
            show_status
            ;;
        "sync")
            sync_branches
            ;;
        "deploy")
            deploy_production
            ;;
        "help"|"-h"|"--help")
            show_usage
            ;;
        "")
            print_error "No command specified"
            show_usage
            exit 1
            ;;
        *)
            print_error "Unknown command: $1"
            show_usage
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@" 