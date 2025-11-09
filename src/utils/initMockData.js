import mockData from '../data/mockData.json';

export default function initMockData() {
  try {
    if (!localStorage.getItem('data_initialized')) {
      console.log('Initializing mock data...');

      const currentUser = localStorage.getItem('currentUser');

      // Xóa các key cũ để tránh trùng
      Object.keys(mockData).forEach(key => {
        localStorage.removeItem(key);
      });

      // Ghi dữ liệu mock vào localStorage
      Object.keys(mockData).forEach(key => {
        const value = mockData[key];
        localStorage.setItem(key, JSON.stringify(Array.isArray(value) ? value : []));
      });

      // Giữ lại người dùng hiện tại nếu có
      if (currentUser) {
        localStorage.setItem('currentUser', currentUser);
      }

      // Đánh dấu đã khởi tạo
      localStorage.setItem('data_initialized', 'true');
      console.log('✅ Mock data initialized successfully');
    }

    // 🩺 Bổ sung tất cả các key bắt buộc, bao gồm appointment_slots
    const requiredKeys = [
      'users', 'doctors', 'patients', 'specialties',
      'appointments', 'appointment_slots',
      'medical_records', 'reviews', 'notifications', 'news'
    ];

    requiredKeys.forEach(key => {
      if (!localStorage.getItem(key)) {
        const value = mockData[key];
        localStorage.setItem(key, JSON.stringify(Array.isArray(value) ? value : []));
      }
    });

    // ✅ Tạo dữ liệu mẫu cho appointment_slots nếu chưa có
    if (!localStorage.getItem('appointment_slots') ||
        JSON.parse(localStorage.getItem('appointment_slots')).length === 0) {
      const doctors = mockData.doctors || [];
      const times = [
        { start_time: "07:30", end_time: "08:00" },
        { start_time: "08:00", end_time: "08:30" },
        { start_time: "08:30", end_time: "09:00" },
        { start_time: "09:00", end_time: "09:30" },
        { start_time: "09:30", end_time: "10:00" },
        { start_time: "10:00", end_time: "10:30" },
        { start_time: "10:30", end_time: "11:00" },
        { start_time: "13:30", end_time: "14:00" },
        { start_time: "14:00", end_time: "14:30" },
        { start_time: "14:30", end_time: "15:00" },
        { start_time: "15:00", end_time: "15:30" },
        { start_time: "15:30", end_time: "16:00" },
        { start_time: "16:00", end_time: "16:30" },
      ];

      const today = new Date();
      const next7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(today);
        d.setDate(d.getDate() + i);
        return d.toISOString().split('T')[0];
      });

      const sampleSlots = [];
      doctors.forEach(doc => {
        next7Days.forEach(date => {
          times.forEach(t => {
            sampleSlots.push({
              id: crypto.randomUUID(),
              doctor_id: doc.id,
              slot_date: date,
              start_time: t.start_time,
              end_time: t.end_time,
              is_available: true,
            });
          });
        });
      });

      localStorage.setItem('appointment_slots', JSON.stringify(sampleSlots));
      console.log('🟢 appointment_slots initialized with sample data');
    }

  } catch (error) {
    console.error('❌ Error initializing mock data:', error);
  }
}
