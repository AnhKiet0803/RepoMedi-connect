import React, { useState, useRef } from "react";
import { Modal, Button, Form, Table, Badge, Image as RBImage } from "react-bootstrap";
import mockData from "../../data/mockData.json";

const ContentManager = () => {
  const [contents, setContents] = useState(
    mockData.contents.map((c) => ({ ...c, published: true }))
  );

  const [form, setForm] = useState({
    title: "",
    specialty: "",
    summary: "",
    content: "",
    published: true,
    image: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  // Filters
  const [filterText, setFilterText] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
      setForm((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      const updated = contents.map((c) =>
        c.id === editingId ? { ...c, ...form } : c
      );
      setContents(updated);
    } else {
      const newItem = {
        id: Date.now(),
        ...form,
        date: new Date().toISOString(),
        published: form.published,
      };
      setContents([...contents, newItem]);
    }
    setShowModal(false);
    setEditingId(null);
    setForm({ title: "", specialty: "", summary: "", content: "", published: true, image: "" });
    setPreviewImage(null);
  };

  const handleEdit = (c) => {
    setForm(c);
    setEditingId(c.id);
    setPreviewImage(c.image);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this content?")) {
      setContents(contents.filter((c) => c.id !== id));
    }
  };

  const togglePublished = (id) => {
    const updated = contents.map((c) =>
      c.id === id ? { ...c, published: !c.published } : c
    );
    setContents(updated);
  };

  // Filtering
  const filteredContents = contents.filter((c) => {
    const textMatch =
      filterText === "" ||
      c.title.toLowerCase().includes(filterText.toLowerCase()) ||
      c.summary.toLowerCase().includes(filterText.toLowerCase()) ||
      c.content.toLowerCase().includes(filterText.toLowerCase());

    const categoryMatch =
      filterCategory === "" ||
      c.specialty.toLowerCase().includes(filterCategory.toLowerCase());

    const statusMatch =
      filterStatus === "" ||
      (filterStatus === "published" && c.published) ||
      (filterStatus === "draft" && !c.published);

    return textMatch && categoryMatch && statusMatch;
  });

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">📚 Medical Content Manager</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <i className="bi bi-plus-lg me-2"></i>Add Content
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-3 d-flex gap-2 flex-wrap">
        <Form.Control
          type="text"
          placeholder="Search by title or content..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          style={{ maxWidth: "250px" }}
        />
        <Form.Control
          type="text"
          placeholder="Filter by category..."
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          style={{ maxWidth: "200px" }}
        />
        <Form.Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ maxWidth: "200px" }}
        >
          <option value="">-- All Statuses --</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </Form.Select>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Specialty</th>
            <th>Summary</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredContents.map((c, i) => (
            <tr key={c.id}>
              <td>{i + 1}</td>
              <td>
                {c.image && (
                  <RBImage
                    src={c.image}
                    alt={c.title}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                      marginRight: "10px",
                    }}
                    rounded
                  />
                )}
                {c.title}
              </td>
              <td>{c.specialty}</td>
              <td>{c.summary}</td>
              <td>
                <Badge bg={c.published ? "success" : "warning"}>
                  {c.published ? "Published" : "Draft"}
                </Badge>
              </td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEdit(c)}
                >
                  <i className="bi bi-pencil me-1"></i>Edit
                </Button>
                <Button
                  variant={c.published ? "info" : "success"}
                  size="sm"
                  className="me-2"
                  onClick={() => togglePublished(c.id)}
                >
                  {c.published ? "Unpublish" : "Publish"}
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(c.id)}
                >
                  <i className="bi bi-trash me-1"></i>Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? "Edit Content" : "Add New Content"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Specialty</Form.Label>
              <Form.Control
                type="text"
                value={form.specialty}
                onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Summary</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={form.summary}
                onChange={(e) => setForm({ ...form, summary: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
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
                  Upload Image
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="d-none"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                {(previewImage || form.image) && (
                  <RBImage
                    src={previewImage || form.image}
                    alt="Preview"
                    style={{ width: "100px", height: "100px", objectFit: "cover" }}
                    rounded
                  />
                )}
              </div>
            </Form.Group>

            <Form.Group>
              <Form.Check
                type="checkbox"
                label="Published"
                checked={form.published}
                onChange={(e) =>
                  setForm({ ...form, published: e.target.checked })
                }
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingId ? "Update" : "Add"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default ContentManager;
