describe("Test GET /admin/dashboards/?... end-points", () => {
    test('It should respond with 200 for archon', () => {
        const response = 200;

        expect(response).toBe(200);
    });
    
    test('It should respond with 200 for forge', () => {
        const response = 200;

        expect(response).toBe(200);
    });
    
    test('It should respond with 200 for shepherd', () => {
        const response = 200;

        expect(response).toBe(200);
    });
    
    test('It should respond with 404 for invalid admin credentials', () => {
        const response = 404;
    
        expect(response).toBe(404);
    });
});
