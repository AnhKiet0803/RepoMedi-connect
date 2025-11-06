import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Form, Table, Badge, Image as RBImage } from 'react-bootstrap';
import mockData from '../../data/mockData.json';

const ContentManager = () => {
  const [contents, setContents] = useState([]);
  const [form, setForm] = useState({
    title: '', 
    category: '', 
    body: '', 
    published: true,
    image: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Initialize from mockData if contents don't exist in localStorage
    const stored = JSON.parse(localStorage.getItem('contents'));
    if (!stored) {
      localStorage.setItem('contents', JSON.stringify(mockData.contents));
      setContents(mockData.contents);
    } else {
      setContents(stored);
    }
  }, []);

  const saveToStorage = updated => {
    setContents(updated);
    try {
      localStorage.setItem('contents', JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save contents to localStorage:', err);
      // Inform the user and attempt to recover UI state
      alert('Lưu nội dung thất bại: bộ nhớ trình duyệt đã đầy hoặc ảnh quá lớn. Hãy thử dùng ảnh nhỏ hơn.');
      // Remove any large image from the form/preview to avoid repeated failures
      setPreviewImage(null);
      setForm(prev => ({ ...prev, image: '' }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Compress and convert image to base64 before storing
    compressImageFile(file, 1024, 0.75)
      .then(base64 => {
        // If base64 is still large, warn the user
        const sizeKB = Math.round((base64.length * (3/4)) / 1024);
        if (sizeKB > 200) {
          if (!window.confirm(`Ảnh sau khi nén vẫn lớn (~${sizeKB}KB). Bạn có muốn tiếp tục lưu ảnh này? Hãy cân nhắc dùng ảnh nhỏ hơn.`)) {
            return;
          }
        }
        setPreviewImage(base64);
        setForm(prev => ({ ...prev, image: base64 }));
      })
      .catch(err => {
        console.error('Image compression failed:', err);
        alert('Không thể xử lý ảnh. Vui lòng thử ảnh khác hoặc giảm kích thước ảnh.');
      });
  };

  // Compress image using canvas and return base64 string
  const compressImageFile = (file, maxWidth = 1024, quality = 0.8) => {
    return new Promise((resolve, reject) => {
      try {
        const img = new Image();
        const reader = new FileReader();
        reader.onload = (ev) => {
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const scale = Math.min(1, maxWidth / img.width);
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            // Try to get compressed JPEG data URL
            const mime = 'image/jpeg';
            let dataUrl = canvas.toDataURL(mime, quality);
            // If still too large and quality can be lowered, try progressively
            let q = quality;
            while (dataUrl.length > 500000 && q > 0.4) { // ~500KB threshold
              q -= 0.1;
              dataUrl = canvas.toDataURL(mime, q);
            }
            resolve(dataUrl);
          };
          img.onerror = (e) => reject(e);
          img.src = ev.target.result;
        };
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
      } catch (e) {
        reject(e);
      }
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (editingId) {
      const updated = contents.map(c =>
        c.id === editingId ? { 
          ...c, 
          ...form,
          updated_at: new Date().toISOString()
        } : c
      );
      saveToStorage(updated);
      setEditingId(null);
    } else {
      const newContent = {
        ...form,
        id: Date.now(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      saveToStorage([...contents, newContent]);
    }
    setForm({ title: '', category: '', body: '', published: true, image: '' });
    setPreviewImage(null);
    setShowModal(false);
  };

  const handleEdit = c => {
    setForm({ ...c });
    setEditingId(c.id);
    setShowModal(true);
  };

  const handleDelete = id => {
    if (window.confirm('Bạn có chắc muốn xóa nội dung này?')) {
      const updated = contents.filter(c => c.id !== id);
      saveToStorage(updated);
    }
  };

  const togglePublished = id => {
    const updated = contents.map(c =>
      c.id === id ? { ...c, published: !c.published } : c
    );
    saveToStorage(updated);
  };

  const handleAdd = () => {
    setForm({ title: '', category: '', body: '', published: true });
    setEditingId(null);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setForm({ title: '', category: '', body: '', published: true });
    setEditingId(null);
  };

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">📢 Quản lý Nội dung y tế</h2>
        <Button variant="primary" onClick={handleAdd}>
          <i className="bi bi-plus-lg me-2"></i>Thêm nội dung mới
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th style={{width: "50px"}}>#</th>
            <th style={{width: "25%"}}>Tiêu đề</th>
            <th style={{width: "15%"}}>Danh mục</th>
            <th>Nội dung</th>
            <th style={{width: "120px"}}>Trạng thái</th>
            <th style={{width: "200px"}}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {contents.map((content, index) => (
            <tr key={content.id}>
              <td>{index + 1}</td>
              <td>
                {content.image && (
                  <RBImage 
                    src={content.image} 
                    alt={content.title}
                    style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px' }}
                    rounded
                  />
                )}
                {content.title}
              </td>
              <td>{content.category}</td>
              <td>
                <div style={{ maxHeight: '100px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {content.body}
                </div>
              </td>
              <td>
                <Badge bg={content.published ? 'success' : 'warning'}>
                  {content.published ? '✅ Đã xuất bản' : '🚫 Nháp'}
                </Badge>
              </td>
              <td>
                <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(content)}>
                  <i className="bi bi-pencil me-1"></i>Sửa
                </Button>
                <Button 
                  variant={content.published ? 'info' : 'success'} 
                  size="sm" 
                  className="me-2"
                  onClick={() => togglePublished(content.id)}
                >
                  <i className={`bi bi-${content.published ? 'eye-slash' : 'eye'} me-1`}></i>
                  {content.published ? 'Ẩn' : 'Xuất bản'}
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(content.id)}>
                  <i className="bi bi-trash me-1"></i>Xóa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? 'Sửa nội dung' : 'Thêm nội dung mới'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Tiêu đề</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tiêu đề"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Danh mục</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập danh mục (ví dụ: bệnh, chữa trị, phòng ngừa...)"
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Nội dung</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Nhập nội dung bài viết"
                value={form.body}
                onChange={e => setForm({ ...form, body: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Hình ảnh</Form.Label>
              <div className="d-flex align-items-center gap-3">
                <Button
                  variant="outline-primary"
                  onClick={() => fileInputRef.current.click()}
                >
                  <i className="bi bi-upload me-2"></i>
                  Chọn ảnh
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="d-none"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                {(previewImage || form.image) && (
                  <div className="position-relative">
                    <RBImage
                      src={previewImage || form.image}
                      alt="Preview"
                      style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                      rounded
                    />
                    <Button
                      variant="danger"
                      size="sm"
                      className="position-absolute top-0 end-0"
                      onClick={() => {
                        setPreviewImage(null);
                        setForm(prev => ({ ...prev, image: '' }));
                      }}
                    >
                      <i className="bi bi-x"></i>
                    </Button>
                  </div>
                )}
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Xuất bản ngay"
                checked={form.published}
                onChange={e => setForm({ ...form, published: e.target.checked })}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Hủy
            </Button>
            <Button variant="primary" type="submit">
              {editingId ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default ContentManager;