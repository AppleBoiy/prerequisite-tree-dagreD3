#!/bin/bash

file_path="$HOME/.zshrc"
search_phrase='ZSH_THEME'
replace_line='ZSH_THEME="powerlevel10k/powerlevel10k"'

# Create a temporary file
touch ./temp.txt
temp_file="./temp.txt"

# Loop through the lines in the file and replace matching lines
while IFS= read -r line; do
    if [[ "$line" == *"$search_phrase"* ]]; then
        echo "$replace_line" >>"$temp_file"
    else
        echo "$line" >>"$temp_file"
    fi
done <"$file_path"

# Replace the original file with the modified contents
mv "$temp_file" "$file_path"
