#!/bin/bash
# Opens all project files in default applications

# Get the directory where the script is located
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "Opening project files..."

# Open Backend files
open "$DIR/Backend/package.json"
open "$DIR/Backend/server.js"

# Open SenderClient files
open "$DIR/SenderClient/index.html"

# Open RecieverClient files
open "$DIR/RecieverClient/index.html"
open "$DIR/RecieverClient/index.css"

# Open README
open "$DIR/README.md"

echo "Done! All files opened."

