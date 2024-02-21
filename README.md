run tests:
- JEST frontend tests:
    cd app/frontend
    npm test -- --watchAll=false
- Pytests against API endpoints
    cd api
    pytest test_api.py
- playwright e2e tests
    having the frontend and backend running
    cd app/e2e
    npx playwright test
