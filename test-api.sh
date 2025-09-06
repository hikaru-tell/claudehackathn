#!/bin/bash

# Deep Research APIテストスクリプト
# 使い方: ./test-api.sh

echo "🧪 Material Search API Test Script"
echo "=================================="
echo ""

# カラー定義
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# APIエンドポイント
BASE_URL="http://localhost:3000/api/materials"

# テストデータ
TEST_DATA='{
  "currentMaterials": {
    "composition": "PET(12μm)/Al-PET(12μm)/CPP(30μm)",
    "properties": ["高バリア性", "高遮光性", "優れたヒートシール性"]
  },
  "requirements": [
    {
      "name": "引張強度",
      "value": "100",
      "unit": "N/15mm",
      "importance": "high"
    },
    {
      "name": "酸素透過率",
      "value": "1.0",
      "unit": "cc/m²·day·atm",
      "importance": "high"
    },
    {
      "name": "水蒸気透過率",
      "value": "2.0",
      "unit": "g/m²·day",
      "importance": "high"
    },
    {
      "name": "耐熱温度",
      "value": "120",
      "unit": "℃",
      "importance": "high"
    }
  ]
}'

# カスタムクエリ付きテストデータ
CUSTOM_QUERY_DATA='{
  "currentMaterials": {
    "composition": "PET/Al/PE",
    "properties": ["高バリア性"]
  },
  "requirements": [
    {
      "name": "引張強度",
      "value": "100",
      "unit": "N/15mm",
      "importance": "high"
    }
  ],
  "searchQuery": "2024年の最新バイオプラスチック技術で、コーヒー豆の包装に適した材料を教えてください。特に酸素バリア性と生分解性を重視しています。"
}'

# 関数: APIテスト実行
test_api() {
    local endpoint=$1
    local data=$2
    local description=$3
    
    echo -e "${YELLOW}Testing: $description${NC}"
    echo "Endpoint: $endpoint"
    echo ""
    
    response=$(curl -s -X POST "$BASE_URL/$endpoint" \
        -H "Content-Type: application/json" \
        -d "$data" 2>&1)
    
    # レスポンスチェック
    if echo "$response" | jq -e '.success' > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Success!${NC}"
        echo "Response preview:"
        echo "$response" | jq '.' | head -20
    elif echo "$response" | jq -e '.error' > /dev/null 2>&1; then
        echo -e "${RED}❌ API Error:${NC}"
        echo "$response" | jq '.error'
    else
        echo -e "${RED}❌ Request failed${NC}"
        echo "$response"
    fi
    
    echo ""
    echo "---"
    echo ""
}

# メニュー表示
show_menu() {
    echo "どのAPIをテストしますか？"
    echo ""
    echo "1) 🔬 Deep Research API (GPT-4)"
    echo "2) 🌱 Database Search API (有機ポリマーDB)"
    echo "3) 🔍 Integrated Search API (統合検索)"
    echo "4) 🎯 Custom Query Deep Research"
    echo "5) 📊 All APIs (全てテスト)"
    echo "0) Exit"
    echo ""
    read -p "選択してください (0-5): " choice
}

# メイン処理
while true; do
    show_menu
    
    case $choice in
        1)
            test_api "GPTsearch" "$TEST_DATA" "Deep Research API"
            ;;
        2)
            test_api "DBsearch" "$TEST_DATA" "Database Search API"
            ;;
        3)
            test_api "search" "$TEST_DATA" "Integrated Search API"
            ;;
        4)
            test_api "GPTsearch" "$CUSTOM_QUERY_DATA" "Custom Query Deep Research"
            ;;
        5)
            echo -e "${GREEN}🚀 Testing all APIs...${NC}"
            echo ""
            test_api "DBsearch" "$TEST_DATA" "Database Search API"
            test_api "GPTsearch" "$TEST_DATA" "Deep Research API"
            test_api "search" "$TEST_DATA" "Integrated Search API"
            test_api "GPTsearch" "$CUSTOM_QUERY_DATA" "Custom Query Deep Research"
            ;;
        0)
            echo "Exiting..."
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid choice. Please try again.${NC}"
            ;;
    esac
    
    read -p "Press Enter to continue..."
    clear
done
