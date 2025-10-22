#!/bin/bash

# Script to find unused components and composables

echo "=== Checking for unused components and composables ==="
echo ""

# Array to store unused files
UNUSED=()

# Check components (excluding subdirectories for now, focus on root components)
for file in components/*.vue; do
    # Get filename without extension
    basename=$(basename "$file" .vue)
    
    # Skip if file doesn't exist
    [ ! -f "$file" ] && continue
    
    # Convert PascalCase to kebab-case for search
    kebab=$(echo "$basename" | sed 's/\([A-Z]\)/-\1/g' | sed 's/^-//' | tr '[:upper:]' '[:lower:]')
    
    # Search for component usage (PascalCase tag, kebab-case tag, or import statement)
    # Exclude the component file itself from the search
    matches=$(grep -r -E "(<$basename|<$kebab|import.*$basename|from.*$basename)" \
        --include="*.vue" --include="*.ts" --include="*.js" \
        pages/ layouts/ components/ app.vue 2>/dev/null | \
        grep -v "^$file:" | wc -l)
    
    if [ "$matches" -eq 0 ]; then
        UNUSED+=("$file")
        echo "❌ UNUSED: $basename"
    fi
done

echo ""
echo "=== Checking composables ==="
echo ""

# Check composables
for file in composables/*.*; do
    basename=$(basename "$file")
    name="${basename%.*}"
    
    # Skip if file doesn't exist
    [ ! -f "$file" ] && continue
    
    # Search for composable usage
    matches=$(grep -r -E "(import.*$name|from.*$name|$name\()" \
        --include="*.vue" --include="*.ts" --include="*.js" \
        pages/ layouts/ components/ composables/ plugins/ 2>/dev/null | \
        grep -v "^$file:" | wc -l)
    
    if [ "$matches" -eq 0 ]; then
        UNUSED+=("$file")
        echo "❌ UNUSED: $name"
    fi
done

echo ""
echo "=== Summary ==="
echo "Total unused files: ${#UNUSED[@]}"
echo ""

if [ ${#UNUSED[@]} -gt 0 ]; then
    echo "Unused files:"
    printf '%s\n' "${UNUSED[@]}"
fi
