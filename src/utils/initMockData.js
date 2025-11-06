import mockData from '../data/mockData.json';

export default function initMockData() {
  try {
    if (!localStorage.getItem('data_initialized')) {
      console.log('Initializing mock data...');

      const currentUser = localStorage.getItem('currentUser');

      Object.keys(mockData).forEach(key => {
        localStorage.removeItem(key);
      });

      Object.keys(mockData).forEach(key => {
        const value = mockData[key];
        localStorage.setItem(key, JSON.stringify(Array.isArray(value) ? value : []));
      });

      if (currentUser) {
        localStorage.setItem('currentUser', currentUser);
      }

      localStorage.setItem('data_initialized', 'true');
      console.log('✅ Mock data initialized successfully');
    }

    const requiredKeys = [
      'users', 'doctors', 'patients', 'specialties',
      'appointments', 'medical_records', 'reviews',
      'notifications', 'news'
    ];

    requiredKeys.forEach(key => {
      if (!localStorage.getItem(key)) {
        const value = mockData[key];
        localStorage.setItem(key, JSON.stringify(Array.isArray(value) ? value : []));
      }
    });

  } catch (error) {
    console.error('❌ Error initializing mock data:', error);
  }
}