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

  // Filter states
  const [filterText, setFilterText] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
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
      console.error('Failed to save contents:', err);
      alert('Failed to save. Browser storage may be full or image too large.');
      setPreviewImage(null);
      setForm(prev => ({ ...prev, image: '' }));
    }
  };

  const handleImageUpload = e => {
    const file = e.target.files[0];
    if (!file) return;

    compressImageFile(file, 1024, 0.75)
      .then(base64 => {
        const sizeKB = Math.round((base64.length * (3 / 4)) / 1024);
        if (sizeKB > 200) {
          if (!window.confirm(`The image is still large (~${sizeKB}KB). Continue?`)) return;
        }
        setPreviewImage(base64);
        setForm(prev => ({ ...prev, image: base64 }));
      })
      .catch(err => {
        console.error('Image compression failed:', err);
        alert('Could not process image. Please try another or reduce size.');
      });
  };

  const compressImageFile = (file, maxWidth = 1024, quality = 0.8) => {
    return new Promise((resolve, reject) => {
      try {
        const img = new Image();
        const reader = new FileReader();
        reader.onload = ev => {
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const scale = Math.min(1, maxWidth / img.width);
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            let dataUrl = canvas.toDataURL('image/jpeg', quality);
            let q = quality;
            while (dataUrl.length > 500000 && q > 0.4) {
              q -= 0.1;
              dataUrl = canvas.toDataURL('image/jpeg', q);
            }
            resolve(dataUrl);
          };
          img.onerror = e => reject(e);
          img.src = ev.target.result;
        };
        reader.onerror = e => reject(e);
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
        c.id === editingId ? { ...c, ...form, updated_at: new Date().toISOString() } : c
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
    if (window.confirm('Are you sure you want to delete this content?')) {
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

  // Apply filters
  const filteredContents = contents.filter(c => {
    const matchesText =
      filterText === '' ||
      c.title.toLowerCase().includes(filterText.toLowerCase()) ||
      c.body.toLowerCase().includes(filterText.toLowerCase());
    const matchesCategory =
      filterCategory === '' ||
      c.category.toLowerCase().includes(filterCategory.toLowerCase());
    const matchesStatus =
      filterStatus === '' ||
      (filterStatus === 'published' && c.published) ||
      (filterStatus === 'draft' && !c.published);
    return matchesText && matchesCategory && matchesStatus;
  });

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">📢 Medical Content Management</h2>
        <Button variant="primary" onClick={handleAdd}>
          <i className="bi bi-plus-lg me-2"></i>Add New Content
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-3 d-flex gap-2">
        <Form.Control
          type="text"
          placeholder="Search by title or content..."
          value={filterText}
          onChange={e => setFilterText(e.target.value)}
          style={{ maxWidth: '250px' }}
        />
        <Form.Control
          type="text"
          placeholder="Filter by category..."
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          style={{ maxWidth: '200px' }}
        />
        <Form.Select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          style={{ maxWidth: '200px' }}
        >
          <option value="">-- All Statuses --</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </Form.Select>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th style={{ width: '50px' }}>#</th>
            <th style={{ width: '25%' }}>Title</th>
            <th style={{ width: '15%' }}>Category</th>
            <th>Content</th>
            <th style={{ width: '120px' }}>Status</th>
            <th style={{ width: '200px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredContents.map((content, index) => (
            <tr key={content.id}>
              <td>{index + 1}</td>
              <td>
                {content.image && (
                  <RBImage
                    src={content.image}
                    alt={content.title}
                    style={{
                      width: '50px',
                      height: '50px',
                      objectFit: 'cover',
                      marginRight: '10px'
                    }}
                    rounded
                  />
                )}
                {content.title}
              </td>
              <td>{content.category}</td>
              <td>
                <div
                  style={{
                    maxHeight: '100px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {content.body}
                </div>
              </td>
              <td>
                <Badge bg={content.published ? 'success' : 'warning'}>
                  {content.published ? '✅ Published' : '🚫 Draft'}
                </Badge>
              </td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEdit(content)}
                >
                  <i className="bi bi-pencil me-1"></i>Edit
                </Button>
                <Button
                  variant={content.published ? 'info' : 'success'}
                  size="sm"
                  className="me-2"
                  onClick={() => togglePublished(content.id)}
                >
                  <i
                    className={`bi bi-${content.published ? 'eye-slash' : 'eye'} me-1`}
                  ></i>
                  {content.published ? 'Unpublish' : 'Publish'}
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(content.id)}
                >
                  <i className="bi bi-trash me-1"></i>Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? 'Edit Content' : 'Add New Content'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category (e.g., disease, treatment, prevention...)"
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Enter article content"
                value={form.body}
                onChange={e => setForm({ ...form, body: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <div className="d-flex align-items-center gap-3">
                <Button
                  variant="outline-primary"
                  onClick={() => fileInputRef.current.click()}
                >
                  <i className="bi bi-upload me-2"></i>Upload Image
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
                      style={{
                        width: '100px',
                        height: '100px',
                        objectFit: 'cover'
                      }}
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
                label="Publish immediately"
                checked={form.published}
                onChange={e => setForm({ ...form, published: e.target.checked })}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingId ? 'Update' : 'Add'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default ContentManager;
