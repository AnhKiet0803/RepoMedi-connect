import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { marked } from "marked";
import mockData from "../data/mockData.json";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Page.css";

export default function NewsDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const articleId = Number(id);
    const newsDataRaw = mockData.contents || [];
    const newsData = useMemo(
        () => [...newsDataRaw].sort((a, b) => new Date(b.date) - new Date(a.date)),
        []
    );

    const idx = newsData.findIndex((n) => n.id === articleId);
    const article = idx >= 0 ? newsData[idx] : null;

    const contentHtml = useMemo(() => {
        return article?.content ? marked.parse(article.content) : "";
    }, [article?.content]);

    if (!article) {
        return (
        <div className="container my-5 text-center">
            <h3>Article not found</h3>
            <button className="btn btn-outline-primary mt-3" onClick={() => navigate("/news")}>← Back to News</button>
        </div>
        );
    }

    return (
        <div className="news-detail-page fade-in">
        <div className="container my-5" style={{ maxWidth: 980 }}>
            <button className="btn btn-outline-secondary mb-4" onClick={() => navigate(-1)}>← Back</button>
            <img src={article.image} alt={article.title} className="img-fluid rounded mb-4 shadow-sm" style={{ width: "100%", maxHeight: 460, objectFit: "cover" }} referrerPolicy="no-referrer" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://placehold.co/1200x600?text=News+Image";}}/>
            <h2 className="fw-bold text-primary mb-2">{article.title}</h2>
            <div className="d-flex justify-content-between align-items-center text-muted mb-3">
                <small>
                    <strong>{article.specialty}</strong> • {new Date(article.date).toLocaleDateString()}
                </small>
                <small>Source: {article.source}</small>
            </div>
            <hr />
            {article.summary && <p className="lead">{article.summary}</p>}
            <div className="mt-3" dangerouslySetInnerHTML={{ __html: contentHtml }}></div>
            <div className="d-flex justify-content-between align-items-center my-4">
                <button className="btn btn-outline-primary" onClick={() => navigate("/articles")}>← Back to News</button>
            </div>
            <hr className="mt-4" />
        </div>
        </div>
    );
}
