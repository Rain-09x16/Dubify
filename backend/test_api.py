"""
Simple API Test Script
Tests all backend endpoints to make sure they're working

Run this after starting the server to verify everything works!

Usage:
    python test_api.py
"""

import requests
import json

# Base URL of your backend
BASE_URL = "http://localhost:8000"

def test_health():
    """Test health check endpoint"""
    print("\n🔍 Testing Health Check...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"✅ Status: {response.status_code}")
        print(f"📄 Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def test_chat():
    """Test chat endpoint"""
    print("\n🔍 Testing Chat Endpoint...")
    try:
        payload = {
            "message": "What is the best time to visit Dubai?",
            "user_id": "test_user_123"
        }
        response = requests.post(f"{BASE_URL}/api/chat", json=payload)
        print(f"✅ Status: {response.status_code}")
        result = response.json()
        print(f"📄 AI Response: {result.get('response', 'No response')[:200]}...")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def test_search():
    """Test search endpoint"""
    print("\n🔍 Testing Search Endpoint...")
    try:
        payload = {
            "query": "family-friendly activities",
            "limit": 5,
            "user_id": "test_user_123"
        }
        response = requests.post(f"{BASE_URL}/api/search", json=payload)
        print(f"✅ Status: {response.status_code}")
        result = response.json()
        print(f"📄 Found {result.get('count', 0)} results")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def test_safety():
    """Test safety check endpoint"""
    print("\n🔍 Testing Safety Check Endpoint...")
    try:
        payload = {
            "location_name": "Dubai Marina",
            "coordinates": {"lat": 25.08, "lng": 55.14},
            "time_of_day": "evening",
            "user_id": "test_user_123"
        }
        response = requests.post(f"{BASE_URL}/api/safety", json=payload)
        print(f"✅ Status: {response.status_code}")
        result = response.json()
        if result.get('success'):
            print(f"📄 Risk Level: {result.get('risk_level')}")
            print(f"📄 Risk Score: {result.get('risk_score')}/100")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def main():
    """Run all tests"""
    print("=" * 60)
    print("🚀 Dubai Navigator AI - Backend API Tests")
    print("=" * 60)

    tests = [
        ("Health Check", test_health),
        ("Chat Endpoint", test_chat),
        ("Search Endpoint", test_search),
        ("Safety Check", test_safety),
    ]

    results = []
    for name, test_func in tests:
        result = test_func()
        results.append((name, result))

    print("\n" + "=" * 60)
    print("📊 Test Results Summary")
    print("=" * 60)
    for name, passed in results:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status} - {name}")

    passed = sum(1 for _, result in results if result)
    total = len(results)
    print(f"\n📈 Total: {passed}/{total} tests passed")

    if passed == total:
        print("\n🎉 All tests passed! Your backend is working perfectly!")
    else:
        print("\n⚠️  Some tests failed. Check the errors above.")

if __name__ == "__main__":
    main()
