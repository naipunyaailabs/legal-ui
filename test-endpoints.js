// Simple test script to verify API endpoints
const testEndpoints = async () => {
  try {
    console.log('Testing API endpoints...');
    
    // Test health check endpoint
    const healthResponse = await fetch('http://localhost:8000/api/health');
    const healthData = await healthResponse.json();
    console.log('Health check:', healthData);
    
    // Test document types endpoint
    const docTypesResponse = await fetch('http://localhost:8000/api/document-types');
    const docTypesData = await docTypesResponse.json();
    console.log('Document types:', docTypesData);
    
    console.log('All endpoint tests completed successfully!');
  } catch (error) {
    console.error('Endpoint test failed:', error);
  }
};

testEndpoints();