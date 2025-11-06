import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import mockData from "../data/mockData.json";
import "./Page.css";

const specialties = [
    { id: 1, name: "Orthopedics" },
    { id: 2, name: "Neurology" },
    { id: 3, name: "Gastroenterology" },
    { id: 4, name: "Cardiology" },
    { id: 5, name: "ENT (Ear, Nose, Throat)" },
    { id: 6, name: "Spine Care" }
];

export default function NewsPage() {
    const navigate = useNavigate();
    const [active, setActive] = useState(0); 
    const [q, setQ] = useState("");
    const newsData = mockData.contents || [];
    const filtered = useMemo(() => {
        let list = [...newsData].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
        );

        if (active !== 0) {
        list = list.filter(n => n.specialtyId === active);
        }

        if (q.trim()) {
        const k = q.toLowerCase();
        list = list.filter(
            n =>
            n.title.toLowerCase().includes(k) ||
            n.summary.toLowerCase().includes(k) ||
            n.source.toLowerCase().includes(k)
        );
        }
        return list;
    }, [active, q]);

    const specialtyMap = useMemo(() => {
        const map = new Map(specialties.map(s => [s.id, s.name]));
        map.set(0, "All");
        return map;
    }, []);

    return (
        <div className="news-page fade-in">
            <div className="container my-5">
                <div className="d-flex align-items-center justify-content-between mb-4">
                    <h2 className="fw-bold text-primary m-0">Health News</h2>
                    <div className="d-flex gap-2">
                        <input className="form-control" placeholder="Search news..." value={q} onChange={(e) => setQ(e.target.value)} style={{ width: 260 }}/>
                        <button className="btn btn-outline-secondary" onClick={() => setQ("")}>Clear</button>
                    </div>
                </div>
                <div className="d-flex flex-wrap gap-2 mb-4">
                    <button className={`btn btn-sm ${active === 0 ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setActive(0)}>All</button>
                    {specialties.map((s) => (
                        <button key={s.id} className={`btn btn-sm ${active === s.id ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setActive(s.id)}>{s.name}</button>
                    ))}
                </div>
                {filtered.length === 0 ? (
                <div className="text-center text-muted py-5">No articles found.</div>
                ) : (
                    <div className="row g-4">
                        {filtered.map((n) => (
                            <div className="col-sm-6 col-lg-4" key={n.id}>
                                <div className="card h-100 shadow-sm"> <img src={n.image} className="card-img-top" alt={n.title} style={{ height: 180, objectFit: "cover" }}/>
                                    <div className="card-body d-flex flex-column">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <span className="badge text-bg-primary">{specialtyMap.get(n.specialtyId)}</span>
                                            <small className="text-muted">{new Date(n.date).toLocaleDateString()}</small>
                                        </div>
                                        <h5 className="card-title">{n.title}</h5>
                                        <p className="card-text text-muted">{n.summary}</p>
                                        <div className="mt-auto d-flex gap-2">
                                            <button className="btn btn-outline-primary btn-sm" onClick={() => navigate(`/news/${n.id}`)}>See more →</button>
                                        </div>
                                    </div>
                                    <div className="card-footer small text-muted">Source: {n.source}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
