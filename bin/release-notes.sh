#!/bin/bash

# git log <yourlasttag>..HEAD
# git log <since_hash>..HEAD excludes the commit

LAST_SPRINT_COMMITS=$(\
    git log \
        --since="2017-07-05" \
        --grep="BREAKING CHANGE\|^feat.*\|^fix.*" \
        --no-merges \
        --format=format:%H \
)

echo "## BREAKING CHANGES:" > breaking_changes.txt
echo "## FEATURES:" > features.txt
echo "## FIXES:" > fixes.txt

for sha1 in $LAST_SPRINT_COMMITS; do
    COMMIT=$(\
        git show \
            --no-patch $sha1 \
            --no-expand-tabs \
            | grep -vE "(^Date|^Author|^commit)" \
            | sed -e 's/^[ \t]*//' \

    )
    if [[ "$COMMIT" =~ .*BREAKING.* ]]; then
        echo $COMMIT >> breaking_changes.txt
        echo "" >> breaking_changes.txt
    fi
    if [[ "$COMMIT" =~ .*fix:.*|.*fix\(.* ]]; then
        echo $COMMIT >> fixes.txt
        echo "" >> fixes.txt
    fi
    if [[ "$COMMIT" =~ .*feat:.*|.*feat\(.* ]]; then
        echo $COMMIT >> features.txt
        echo "" >> features.txt
    fi

done

cat breaking_changes.txt features.txt fixes.txt > release_notes.md
rm -rf breaking_changes.txt features.txt fixes.txt