/**
 * RouterService Test
 * 
 * Simpele test om te verifiëren dat RouterService correct werkt
 * Run deze test in de browser console na het laden van RouterService
 */

function testRouterService() {
    console.log('=== RouterService Tests ===\n');

    // Maak een nieuwe RouterService instance
    const router = new RouterService();

    // Test 1: getRoute()
    console.log('Test 1: getRoute()');
    const week1Route = router.getRoute('week-1');
    console.log('  week-1 route:', week1Route);
    console.log('  ✓ Week 1 route found:', week1Route !== null);
    console.log('  ✓ Title:', week1Route?.title === 'Week 1');
    console.log('  ✓ Subtitle:', week1Route?.subtitle === 'Neuro-psycho-immunologie');
    
    const startRoute = router.getRoute('start');
    console.log('  start route:', startRoute);
    console.log('  ✓ Start route found:', startRoute !== null);
    console.log('  ✓ Is dashboard:', startRoute?.isDashboard === true);
    
    const invalidRoute = router.getRoute('invalid-route');
    console.log('  invalid-route:', invalidRoute);
    console.log('  ✓ Invalid route returns null:', invalidRoute === null);
    console.log('');

    // Test 2: parseUrl()
    console.log('Test 2: parseUrl()');
    
    const testCases = [
        { url: 'week1.html', expected: { moduleId: 'week-1', hash: null } },
        { url: 'week2.html#probleem-verkennen', expected: { moduleId: 'week-2', hash: '#probleem-verkennen' } },
        { url: 'index.html', expected: { moduleId: 'start', hash: null } },
        { url: '/week3.html', expected: { moduleId: 'week-3', hash: null } },
        { url: '/week4.html#section', expected: { moduleId: 'week-4', hash: '#section' } },
        { url: 'week5.html', expected: { moduleId: 'week-5', hash: null } },
        { url: 'register.html#term', expected: { moduleId: 'register', hash: '#term' } },
        { url: 'afsluiting.html', expected: { moduleId: 'afsluiting', hash: null } },
        { url: '', expected: { moduleId: 'start', hash: null } },
        { url: '/', expected: { moduleId: 'start', hash: null } },
        { url: '#section', expected: { moduleId: 'start', hash: '#section' } }
    ];

    let parseUrlPassed = 0;
    testCases.forEach((testCase, index) => {
        const result = router.parseUrl(testCase.url);
        const passed = result.moduleId === testCase.expected.moduleId && 
                       result.hash === testCase.expected.hash;
        if (passed) parseUrlPassed++;
        console.log(`  Test ${index + 1}: ${testCase.url}`);
        console.log(`    Expected:`, testCase.expected);
        console.log(`    Got:`, result);
        console.log(`    ${passed ? '✓' : '✗'} ${passed ? 'PASSED' : 'FAILED'}`);
    });
    console.log(`  ✓ parseUrl() tests: ${parseUrlPassed}/${testCases.length} passed\n`);

    // Test 3: getCurrentRoute()
    console.log('Test 3: getCurrentRoute()');
    const currentRoute = router.getCurrentRoute();
    console.log('  Current route:', currentRoute);
    console.log('  ✓ Returns object with moduleId and hash:', 
                currentRoute !== null && 
                typeof currentRoute === 'object' && 
                'moduleId' in currentRoute && 
                'hash' in currentRoute);
    console.log('');

    // Test 4: isValidRoute()
    console.log('Test 4: isValidRoute()');
    const validRoutes = ['start', 'week-1', 'week-2', 'week-3', 'week-4', 'week-5', 'week-6', 'week-7', 'register', 'afsluiting'];
    const invalidRoutes = ['invalid', 'week-8', 'test', ''];
    
    let isValidPassed = 0;
    validRoutes.forEach(route => {
        const isValid = router.isValidRoute(route);
        if (isValid) isValidPassed++;
        console.log(`  ${route}: ${isValid ? '✓' : '✗'} ${isValid ? 'valid' : 'invalid'}`);
    });
    console.log(`  ✓ Valid routes: ${isValidPassed}/${validRoutes.length} correctly identified`);
    
    let isInvalidPassed = 0;
    invalidRoutes.forEach(route => {
        const isValid = router.isValidRoute(route);
        if (!isValid) isInvalidPassed++;
        console.log(`  ${route}: ${isValid ? '✗' : '✓'} ${isValid ? 'valid (WRONG!)' : 'invalid'}`);
    });
    console.log(`  ✓ Invalid routes: ${isInvalidPassed}/${invalidRoutes.length} correctly identified\n`);

    // Test 5: navigateTo()
    console.log('Test 5: navigateTo()');
    try {
        const navResult = router.navigateTo('week-1');
        console.log('  ✓ Navigate to week-1 succeeded:', navResult !== null);
        console.log('  Route config:', navResult);
        
        const navResultWithHash = router.navigateTo('week-2', '#probleem-verkennen');
        console.log('  ✓ Navigate to week-2 with hash succeeded:', navResultWithHash !== null);
    } catch (error) {
        console.log('  ✗ Navigate failed:', error.message);
    }
    
    try {
        router.navigateTo('invalid-route');
        console.log('  ✗ Navigate to invalid route should have thrown error');
    } catch (error) {
        console.log('  ✓ Navigate to invalid route correctly threw error:', error.message);
    }
    console.log('');

    // Test 6: All routes defined
    console.log('Test 6: All routes defined');
    const expectedModuleIds = ['start', 'week-1', 'week-2', 'week-3', 'week-4', 'week-5', 'week-6', 'week-7', 'register', 'afsluiting'];
    let allRoutesDefined = 0;
    expectedModuleIds.forEach(moduleId => {
        const route = router.getRoute(moduleId);
        if (route !== null) {
            allRoutesDefined++;
            console.log(`  ✓ ${moduleId}: ${route.title}${route.subtitle ? ' - ' + route.subtitle : ''}`);
        } else {
            console.log(`  ✗ ${moduleId}: NOT DEFINED`);
        }
    });
    console.log(`  ✓ Routes defined: ${allRoutesDefined}/${expectedModuleIds.length}\n`);

    console.log('=== Tests Complete ===');
    return router;
}

// Auto-run test if RouterService is available
if (typeof RouterService !== 'undefined') {
    console.log('RouterService found, running tests...\n');
    testRouterService();
} else {
    console.log('RouterService not found. Make sure RouterService.js is loaded before running tests.');
}
