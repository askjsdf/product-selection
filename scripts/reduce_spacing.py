#!/usr/bin/env python3
"""
Reduce spacing in step2.css after font size reduction
Focus on segment detail card and overall module spacing
"""

import re

# Read the CSS file
with open('/Volumes/SD2/product-selection/product-selection/assets/css/step2.css', 'r', encoding='utf-8') as f:
    content = f.read()

# Backup
with open('/Volumes/SD2/product-selection/product-selection/assets/css/step2.css.backup', 'w', encoding='utf-8') as f:
    f.write(content)

# Define spacing reduction replacements
# Target: reduce larger spacing values to create more compact layout
replacements = [
    # Reduce large spacing
    ('margin-top: var(--spacing-md)', 'margin-top: var(--spacing-xs)'),
    ('margin-bottom: var(--spacing-md)', 'margin-bottom: var(--spacing-xs)'),
    ('margin: var(--spacing-md)', 'margin: var(--spacing-xs)'),

    # Reduce medium gaps to small
    ('gap: var(--spacing-md)', 'gap: var(--spacing-xs)'),

    # Keep only specific larger paddings (like main containers)
    # Don't reduce all padding-lg, only specific ones
]

# Apply replacements
for old, new in replacements:
    content = content.replace(old, new)

# Write back
with open('/Volumes/SD2/product-selection/product-selection/assets/css/step2.css', 'w', encoding='utf-8') as f:
    f.write(content)

print("✓ Spacing reduction complete")
print(f"✓ Backup saved to step2.css.backup")
