// Load mock data into localStorage on first run so managers can read and mutate it
import mockData from '../../data/mockData.json';

export default function initMockData() {
  try {
    // Reset all data if not initialized
    if (!localStorage.getItem('data_initialized')) {
      console.log('Initializing mock data...');
      
      // Clear existing data
      Object.keys(mockData).forEach(key => {
        localStorage.removeItem(key);
      });

      // Initialize with mock data
      Object.keys(mockData).forEach(key => {
        localStorage.setItem(key, JSON.stringify(mockData[key] || []));
      });

      // Mark as initialized
      localStorage.setItem('data_initialized', 'true');
      console.log('Mock data initialized successfully');
    }

    // Ensure all required keys exist
    const requiredKeys = [
      'users', 'doctors', 'patients', 'specialties',
      'appointments', 'medical_records', 'reviews',
      'notifications', 'news' 
    ];

    requiredKeys.forEach(key => {
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify(mockData[key] || []));
      }
    });

  } catch (error) {
    console.error('Error initializing mock data:', error);
  }
}