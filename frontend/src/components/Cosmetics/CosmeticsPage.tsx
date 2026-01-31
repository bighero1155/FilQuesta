import React, { useEffect, useState } from "react";
import {
  Cosmetic,
  getCosmetics,
  createCosmetic,
  updateCosmetic,
  deleteCosmetic,
} from "../../services/cosmeticService";

const CosmeticsPage: React.FC = () => {
  const [cosmetics, setCosmetics] = useState<Cosmetic[]>([]);
  const [form, setForm] = useState<Cosmetic>({
    cosmetic_id: undefined,
    type: "avatar",
    name: "", 
    description: "",
    price: 0,
    image: undefined,   
  });
  
  // 🔥 NEW: Track existing image URL for preview during edit
  const [existingImageUrl, setExistingImageUrl] = useState<string | undefined>(undefined);

  const fetchCosmetics = async () => {
    try { 
      const data = await getCosmetics();
      setCosmetics(data);
    } catch (err) {
      console.error("Failed to fetch cosmetics:", err);
      alert("Failed to load cosmetics. Are you logged in?");
    }
  };

  useEffect(() => {
    fetchCosmetics();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (form.cosmetic_id) {
        await updateCosmetic(form.cosmetic_id, form);
      } else {
        await createCosmetic(form);
      }
      // Reset form
      setForm({ 
        cosmetic_id: undefined, 
        type: "avatar", 
        name: "", 
        description: "", 
        price: 0, 
        image: undefined 
      });
      setExistingImageUrl(undefined);
      fetchCosmetics();
    } catch (err) {
      console.error("Failed to save cosmetic:", err);
      alert("Failed to save cosmetic.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this cosmetic?")) return;
    try {
      await deleteCosmetic(id);
      fetchCosmetics();
    } catch (err) {
      console.error("Failed to delete cosmetic:", err);
      alert("Failed to delete cosmetic.");
    }
  };

  // 🔥 NEW: Handle edit button click
  const handleEdit = (cosmetic: Cosmetic) => {
    setForm({
      cosmetic_id: cosmetic.cosmetic_id,
      type: cosmetic.type,
      name: cosmetic.name,
      description: cosmetic.description,
      price: cosmetic.price,
      image: undefined, // ✅ Don't include the URL in form.image
    });
    
    // Store the existing image URL for preview
    if (typeof cosmetic.image === 'string') {
      setExistingImageUrl(cosmetic.image);
    }
  };

  // 🔥 NEW: Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm({ ...form, image: file });
      setExistingImageUrl(undefined); // Clear existing preview when new file selected
    }
  };

  // 🔥 NEW: Get preview image URL
  const getPreviewUrl = (): string | undefined => {
    if (form.image instanceof File) {
      return URL.createObjectURL(form.image);
    }
    return existingImageUrl;
  };

  return (
    <div className="cosmetics-page">
      {/* Animated background elements */}
      <div className="cosmetics-bg-elements">
        <div className="cosmetic-icon icon-1">👑</div>
        <div className="cosmetic-icon icon-2">✨</div>
        <div className="cosmetic-icon icon-3">💎</div>
        <div className="cosmetic-icon icon-4">🎨</div>
        <div className="cosmetic-icon icon-5">🌟</div>
        <div className="cosmetic-icon icon-6">🎭</div>
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>

      <div className="container position-relative" style={{ zIndex: 2 }}>
        <h1 className="page-title text-center mb-3">
          ✨ Cosmetics Management
        </h1>
        <p className="page-subtitle text-center mb-5">
          Create and manage avatars, badges, and nickname frames
        </p>

        {/* Form Card */}
        <div className="form-card mb-5">
          <h3 className="form-card-title mb-4">
            {form.cosmetic_id ? "✏️ Edit Cosmetic" : "➕ Create New Cosmetic"}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Type</label>
                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm({ ...form, type: e.target.value as "avatar" | "badge" | "nick_frame" })
                  }
                  className="form-control styled-select"
                >
                  <option value="avatar">👤 Avatar</option>
                  <option value="badge">🏆 Badge</option>
                  <option value="nick_frame">🖼️ Nickname Frame</option>
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="form-control styled-input"
                  placeholder="Enter cosmetic name"
                  required
                />
              </div>

              <div className="col-md-12 mb-3">
                <label className="form-label">Description</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="form-control styled-input"
                  placeholder="Enter description (optional)"
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Price (Coins)</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      price: e.target.value === "" ? 0 : parseInt(e.target.value),
                    })
                  }
                  className="form-control styled-input"
                  placeholder="0"
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Image {form.cosmetic_id && "(Leave empty to keep current)"}
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="form-control styled-input"
                  accept="image/*"
                />
              </div>

              {/* 🔥 NEW: Image Preview */}
              {getPreviewUrl() && (
                <div className="col-12 mb-3">
                  <div className="image-preview-wrapper">
                    <label className="form-label">Preview</label>
                    <div className="image-preview-container">
                      <img
                        src={getPreviewUrl()}
                        alt="Preview"
                        className="image-preview"
                      />
                      {form.image instanceof File && (
                        <button
                          type="button"
                          className="btn-remove-preview"
                          onClick={() => {
                            setForm({ ...form, image: undefined });
                            // Restore existing image if editing
                            if (form.cosmetic_id) {
                              const original = cosmetics.find(c => c.cosmetic_id === form.cosmetic_id);
                              if (original && typeof original.image === 'string') {
                                setExistingImageUrl(original.image);
                              }
                            }
                          }}
                        >
                          ✕ Remove New Image
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="col-12 text-center mt-3">
                <button type="submit" className="btn-submit">
                  {form.cosmetic_id ? "💾 Update Cosmetic" : "🎨 Create Cosmetic"}
                </button>
                {form.cosmetic_id && (
                  <button
                    type="button"
                    className="btn-cancel ms-3"
                    onClick={() => {
                      setForm({
                        cosmetic_id: undefined,
                        type: "avatar",
                        name: "",
                        description: "",
                        price: 0,
                        image: undefined,
                      });
                      setExistingImageUrl(undefined);
                    }}
                  >
                    ❌ Cancel Edit
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Cosmetics Grid */}
        <h3 className="section-title text-center mb-4">
          🎭 All Cosmetics
        </h3>
        <div className="row">
          {cosmetics.map((c) => (
            <div key={c.cosmetic_id} className="col-lg-4 col-md-6 mb-4">
              <div className="cosmetic-card">
                <div className="cosmetic-card-header">
                  <span className="cosmetic-type-badge">
                    {c.type === "avatar" ? "👤" : c.type === "badge" ? "🏆" : "🖼️"}
                    {" " + c.type}
                  </span>
                </div>
                {c.image && typeof c.image === 'string' && (
                  <div className="cosmetic-image-wrapper">
                    <img
                      src={c.image}
                      alt={c.name}
                      className="cosmetic-image"
                      onError={(e) => {
                        console.error('Cosmetic image failed to load:', c.image);
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent && !parent.querySelector('.no-image-placeholder')) {
                          const placeholder = document.createElement('div');
                          placeholder.className = 'no-image-placeholder';
                          placeholder.innerHTML = '🖼️<br/>No Image';
                          parent.appendChild(placeholder);
                        }
                      }}
                    />
                  </div>
                )}
                <div className="cosmetic-card-body">
                  <h5 className="cosmetic-name">{c.name}</h5>
                  <p className="cosmetic-description">{c.description || "No description"}</p>
                  <div className="cosmetic-price">
                    <span className="price-label">Price:</span>
                    <span className="price-value">{c.price} 🪙</span>
                  </div>
                  <div className="cosmetic-actions">
                    <button 
                      className="btn-edit" 
                      onClick={() => handleEdit(c)} // 🔥 FIXED: Use handleEdit instead
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(c.cosmetic_id!)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .cosmetics-page {
          min-height: 100vh;
          padding: 40px 20px;
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #ffd140 100%);
          position: relative;
          overflow-x: hidden;
        }

        /* Animated Background */
        .cosmetics-bg-elements {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 1;
          pointer-events: none;
        }

        .cosmetic-icon {
          position: absolute;
          font-size: 3rem;
          opacity: 0.15;
          animation: float 20s infinite ease-in-out;
        }

        .icon-1 {
          top: 10%;
          left: 15%;
          animation-delay: 0s;
        }

        .icon-2 {
          top: 60%;
          left: 10%;
          animation-delay: 3s;
        }

        .icon-3 {
          top: 20%;
          right: 20%;
          animation-delay: 1.5s;
        }

        .icon-4 {
          bottom: 15%;
          right: 15%;
          animation-delay: 4s;
        }

        .icon-5 {
          top: 70%;
          right: 25%;
          animation-delay: 2s;
        }

        .icon-6 {
          bottom: 30%;
          left: 25%;
          animation-delay: 5s;
        }

        .circle {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.08);
          animation: pulse 15s infinite ease-in-out;
        }

        .circle-1 {
          width: 300px;
          height: 300px;
          top: -100px;
          right: -100px;
        }

        .circle-2 {
          width: 400px;
          height: 400px;
          bottom: -150px;
          left: -150px;
          animation-delay: 3s;
        }

        .circle-3 {
          width: 250px;
          height: 250px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation-delay: 1.5s;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          25% {
            transform: translateY(-30px) rotate(5deg);
          }
          50% {
            transform: translateY(-50px) rotate(-5deg);
          }
          75% {
            transform: translateY(-30px) rotate(3deg);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.08;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.15;
          }
        }

        /* Page Title */
        .page-title {
          color: white;
          font-size: 3rem;
          font-weight: bold;
          text-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
          margin-bottom: 1rem;
        }

        .page-subtitle {
          color: rgba(255, 255, 255, 0.95);
          font-size: 1.2rem;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }

        /* Form Card */
        .form-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 25px;
          padding: 2.5rem;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(10px);
          transition: transform 0.3s ease;
        }

        .form-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
        }

        .form-card-title {
          color: #f5576c;
          font-weight: bold;
          font-size: 1.8rem;
          text-align: center;
        }

        .form-label {
          color: #f5576c;
          font-weight: 600;
          font-size: 0.95rem;
          margin-bottom: 0.5rem;
        }

        .styled-input,
        .styled-select {
          border: 2px solid #f093fb;
          border-radius: 12px;
          padding: 0.75rem 1rem;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: white;
        }

        .styled-input:focus,
        .styled-select:focus {
          border-color: #f5576c;
          box-shadow: 0 0 0 3px rgba(245, 87, 108, 0.1);
          outline: none;
        }

        /* 🔥 NEW: Image Preview Styles */
        .image-preview-wrapper {
          padding: 1rem;
          background: rgba(240, 147, 251, 0.05);
          border-radius: 15px;
        }

        .image-preview-container {
          position: relative;
          display: inline-block;
        }

        .image-preview {
          max-width: 300px;
          max-height: 200px;
          object-fit: contain;
          border-radius: 12px;
          border: 3px solid #f093fb;
          padding: 0.5rem;
          background: white;
        }

        .btn-remove-preview {
          position: absolute;
          top: -10px;
          right: -10px;
          background: #f5576c;
          color: white;
          border: none;
          border-radius: 50px;
          padding: 0.5rem 1rem;
          font-size: 0.85rem;
          font-weight: bold;
          cursor: pointer;
          box-shadow: 0 3px 10px rgba(245, 87, 108, 0.4);
          transition: all 0.3s ease;
        }

        .btn-remove-preview:hover {
          background: #e74c3c;
          transform: scale(1.05);
        }

        .btn-submit {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          color: white;
          border: none;
          padding: 1rem 3rem;
          border-radius: 50px;
          font-size: 1.1rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 5px 20px rgba(245, 87, 108, 0.3);
        }

        .btn-submit:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(245, 87, 108, 0.4);
        }

        /* 🔥 NEW: Cancel Button */
        .btn-cancel {
          background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 50px;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 5px 20px rgba(108, 117, 125, 0.3);
        }

        .btn-cancel:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(108, 117, 125, 0.4);
        }

        /* Section Title */
        .section-title {
          color: white;
          font-size: 2rem;
          font-weight: bold;
          text-shadow: 0 3px 12px rgba(0, 0, 0, 0.3);
        }

        /* Cosmetic Cards */
        .cosmetic-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          transition: all 0.4s ease;
          height: 100%;
        }

        .cosmetic-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
        }

        .cosmetic-card-header {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          padding: 0.75rem 1rem;
          text-align: center;
        }

        .cosmetic-type-badge {
          color: white;
          font-weight: bold;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .cosmetic-image-wrapper {
          width: 100%;
          height: 200px;
          overflow: hidden;
          background: linear-gradient(135deg, #ffd140 0%, #f093fb 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          position: relative;
        }

        .cosmetic-image {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          border-radius: 10px;
        }

        .no-image-placeholder {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          color: white;
          font-size: 1.2rem;
          font-weight: bold;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .cosmetic-card-body {
          padding: 1.5rem;
        }

        .cosmetic-name {
          color: #f5576c;
          font-weight: bold;
          font-size: 1.3rem;
          margin-bottom: 0.5rem;
        }

        .cosmetic-description {
          color: #666;
          font-size: 0.95rem;
          margin-bottom: 1rem;
          min-height: 2.5rem;
        }

        .cosmetic-price {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding: 0.75rem;
          background: linear-gradient(135deg, rgba(240, 147, 251, 0.1) 0%, rgba(245, 87, 108, 0.1) 100%);
          border-radius: 10px;
        }

        .price-label {
          color: #f5576c;
          font-weight: 600;
        }

        .price-value {
          color: #f5576c;
          font-weight: bold;
          font-size: 1.2rem;
        }

        .cosmetic-actions {
          display: flex;
          gap: 0.75rem;
        }

        .btn-edit,
        .btn-delete {
          flex: 1;
          padding: 0.75rem;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.95rem;
        }

        .btn-edit {
          background: linear-gradient(135deg, #ffd140 0%, #ffaa00 100%);
          color: white;
        }

        .btn-edit:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(255, 170, 0, 0.4);
        }

        .btn-delete {
          background: linear-gradient(135deg, #f5576c 0%, #e74c3c 100%);
          color: white;
        }

        .btn-delete:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(231, 76, 60, 0.4);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .cosmetic-icon {
            font-size: 2rem;
          }

          .page-title {
            font-size: 2rem;
          }

          .page-subtitle {
            font-size: 1rem;
          }

          .form-card {
            padding: 1.5rem;
          }

          .form-card-title {
            font-size: 1.4rem;
          }

          .section-title {
            font-size: 1.5rem;
          }

          .image-preview {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default CosmeticsPage;