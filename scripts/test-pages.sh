#!/bin/bash
# Basic page load tests for AI@Skills
# Usage: ./scripts/test-pages.sh [BASE_URL]

BASE_URL="${1:-http://localhost:3000}"
FAILED=0
PASSED=0

echo "=========================================="
echo "AI@Skills Page Load Tests"
echo "Base URL: $BASE_URL"
echo "=========================================="
echo ""

# Test function
test_page() {
    local name="$1"
    local url="$2"
    local expected_status="${3:-200}"
    local expected_content="$4"
    
    echo -n "Testing: $name... "
    
    # Fetch the page
    response=$(curl -s -w "\n%{http_code}" "$url" 2>/dev/null)
    status_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    # Check status code
    if [ "$status_code" != "$expected_status" ]; then
        echo "FAILED (expected status $expected_status, got $status_code)"
        FAILED=$((FAILED + 1))
        return 1
    fi
    
    # Check content if specified
    if [ -n "$expected_content" ]; then
        if echo "$body" | grep -q "$expected_content"; then
            echo "PASSED"
            PASSED=$((PASSED + 1))
            return 0
        else
            echo "FAILED (content '$expected_content' not found)"
            FAILED=$((FAILED + 1))
            return 1
        fi
    fi
    
    echo "PASSED"
    PASSED=$((PASSED + 1))
    return 0
}

# Test function for JSON APIs
test_api() {
    local name="$1"
    local url="$2"
    local expected_key="$3"
    
    echo -n "Testing API: $name... "
    
    # Fetch the API
    response=$(curl -s -w "\n%{http_code}" -H "Accept: application/json" "$url" 2>/dev/null)
    status_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    # Check status code
    if [ "$status_code" != "200" ]; then
        echo "FAILED (expected status 200, got $status_code)"
        FAILED=$((FAILED + 1))
        return 1
    fi
    
    # Check for JSON key if specified
    if [ -n "$expected_key" ]; then
        if echo "$body" | grep -q "\"$expected_key\""; then
            echo "PASSED"
            PASSED=$((PASSED + 1))
            return 0
        else
            echo "FAILED (key '$expected_key' not found in JSON)"
            FAILED=$((FAILED + 1))
            return 1
        fi
    fi
    
    echo "PASSED"
    PASSED=$((PASSED + 1))
    return 0
}

echo "--- Page Tests ---"
test_page "Homepage loads" "$BASE_URL/" "200" "AI@Skills"
test_page "Homepage has hero text" "$BASE_URL/" "200" "Skills for your"
test_page "Homepage has navigation" "$BASE_URL/" "200" "href=\"/skills\""
test_page "Skills page loads" "$BASE_URL/skills" "200"
test_page "Submit page loads" "$BASE_URL/submit" "200"
test_page "Admin page loads" "$BASE_URL/admin" "200"

echo ""
echo "--- API Tests ---"
test_api "GET /api/skills" "$BASE_URL/api/skills" "skills"
test_api "GET /api/skills with limit" "$BASE_URL/api/skills?limit=5" "pagination"

echo ""
echo "--- Static Asset Tests ---"
test_page "Favicon" "$BASE_URL/favicon.ico" "200"

echo ""
echo "=========================================="
echo "Results: $PASSED passed, $FAILED failed"
echo "=========================================="

if [ $FAILED -gt 0 ]; then
    exit 1
fi
exit 0
