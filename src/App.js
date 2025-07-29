import React, { useState, useEffect } from 'react';
import { Camera, Plus, Wine, Calendar, DollarSign, Star, MapPin, Trash2, Edit3, Search, Filter } from 'lucide-react';
import './App.css';

// Separate AddWineForm component to prevent re-render issues
const AddWineForm = ({ onAddWine, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    vintage: '',
    producer: '',
    region: '',
    purchaseDate: '',
    purchasePrice: '',
    store: '',
    myRating: 0,
    notes: ''
  });

  const handleSubmit = () => {
    if (formData.name && formData.vintage) {
      onAddWine(formData);
      setFormData({
        name: '',
        vintage: '',
        producer: '',
        region: '',
        purchaseDate: '',
        purchasePrice: '',
        store: '',
        myRating: 0,
        notes: ''
      });
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Add New Wine</h2>
        
        <div className="form-container">
          <div>
            <button className="photo-upload-button">
              <Camera className="camera-icon" />
              <p className="photo-text">Take Photo of Label</p>
            </button>
          </div>

          <input
            type="text"
            placeholder="Wine Name"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            className="form-input"
          />

          <div className="form-row">
            <input
              type="number"
              placeholder="Vintage Year"
              value={formData.vintage}
              onChange={(e) => updateField('vintage', e.target.value)}
              className="form-input"
            />
            <input
              type="number"
              placeholder="Purchase Price"
              value={formData.purchasePrice}
              onChange={(e) => updateField('purchasePrice', e.target.value)}
              className="form-input"
            />
          </div>

          <input
            type="text"
            placeholder="Producer/Winery"
            value={formData.producer}
            onChange={(e) => updateField('producer', e.target.value)}
            className="form-input"
          />

          <input
            type="text"
            placeholder="Region"
            value={formData.region}
            onChange={(e) => updateField('region', e.target.value)}
            className="form-input"
          />

          <div className="form-row">
            <input
              type="date"
              value={formData.purchaseDate}
              onChange={(e) => updateField('purchaseDate', e.target.value)}
              className="form-input"
            />
            <input
              type="text"
              placeholder="Store"
              value={formData.store}
              onChange={(e) => updateField('store', e.target.value)}
              className="form-input"
            />
          </div>

          <div>
            <label className="rating-label">My Rating</label>
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => updateField('myRating', star)}
                  className={`star-button ${star <= formData.myRating ? 'star-active' : 'star-inactive'}`}
                >
                  <Star className="star" />
                </button>
              ))}
            </div>
          </div>

          <textarea
            placeholder="Tasting notes..."
            value={formData.notes}
            onChange={(e) => updateField('notes', e.target.value)}
            className="form-textarea"
            rows="3"
          />
        </div>

        <div className="modal-buttons">
          <button
            onClick={handleSubmit}
            className="add-button"
          >
            Add Wine
          </button>
          <button
            onClick={onClose}
            className="cancel-button"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const WineInventoryApp = () => {
  const [wines, setWines] = useState([]);
  const [activeTab, setActiveTab] = useState('inventory');
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Load wines from localStorage on component mount
  useEffect(() => {
    const savedWines = localStorage.getItem('wine-inventory');
    if (savedWines) {
      setWines(JSON.parse(savedWines));
    } else {
      // Initial sample data if no saved wines
      const sampleWines = [
        {
          id: 1,
          name: "Caymus Cabernet Sauvignon",
          vintage: 2020,
          producer: "Caymus Vineyards",
          region: "Napa Valley, CA",
          purchaseDate: "2024-01-15",
          purchasePrice: 89.99,
          currentPrice: 95.00,
          store: "Total Wine",
          status: "in_cellar",
          myRating: 4.5,
          publicRating: 4.2,
          photo: "📷",
          notes: "Rich and full-bodied, great with steak"
        },
        {
          id: 2,
          name: "Dom Pérignon Vintage",
          vintage: 2012,
          producer: "Moët & Chandon",
          region: "Champagne, France",
          purchaseDate: "2023-12-20",
          purchasePrice: 199.99,
          currentPrice: 220.00,
          store: "Wine.com",
          status: "consumed",
          myRating: 5.0,
          publicRating: 4.8,
          photo: "📷",
          notes: "Special anniversary dinner at Le Bernardin",
          consumedDate: "2024-02-14",
          consumedLocation: "Le Bernardin, NYC",
          occasion: "Anniversary"
        }
      ];
      setWines(sampleWines);
    }
  }, []);

  // Save wines to localStorage whenever wines array changes
  useEffect(() => {
    if (wines.length > 0) {
      localStorage.setItem('wine-inventory', JSON.stringify(wines));
    }
  }, [wines]);

  const handleAddWine = (formData) => {
    const wine = {
      id: Date.now(),
      ...formData,
      purchasePrice: parseFloat(formData.purchasePrice) || 0,
      status: 'in_cellar',
      photo: '📷',
      currentPrice: parseFloat(formData.purchasePrice) * 1.1 || 0, // Simulated current price
      publicRating: 4.0 + Math.random() * 1 // Random public rating
    };
    setWines(prev => [...prev, wine]);
    setShowAddForm(false);
  };

  const handleConsumeWine = (id) => {
    setWines(prev => prev.map(wine => 
      wine.id === id 
        ? { ...wine, status: 'consumed', consumedDate: new Date().toISOString().split('T')[0] }
        : wine
    ));
  };

  const handleDeleteWine = (id) => {
    setWines(prev => prev.filter(wine => wine.id !== id));
  };

  const filteredWines = wines.filter(wine => {
    const matchesSearch = wine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         wine.producer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || wine.status === filterType;
    return matchesSearch && matchesFilter;
  });

  const inventoryWines = filteredWines.filter(wine => wine.status === 'in_cellar');
  const consumedWines = filteredWines.filter(wine => wine.status === 'consumed');

  const totalValue = inventoryWines.reduce((sum, wine) => sum + (wine.currentPrice || wine.purchasePrice), 0);
  const totalPurchaseValue = inventoryWines.reduce((sum, wine) => sum + wine.purchasePrice, 0);

  const WineCard = ({ wine, showConsumeButton = true }) => (
    <div className="wine-card">
      <div className="wine-header">
        <div className="wine-info">
          <h3 className="wine-name">{wine.name}</h3>
          <p className="wine-producer">{wine.vintage} • {wine.producer}</p>
          <p className="wine-region">{wine.region}</p>
        </div>
        <div className="wine-photo">{wine.photo}</div>
      </div>

      <div className="wine-details">
        <div className="wine-detail">
          <Calendar className="detail-icon" />
          {new Date(wine.purchaseDate).toLocaleDateString()}
        </div>
        <div className="wine-detail">
          <DollarSign className="detail-icon" />
          ${wine.purchasePrice}
        </div>
        {wine.currentPrice && (
          <div className="wine-detail">
            <span className="detail-label">Current:</span>
            ${wine.currentPrice.toFixed(2)}
          </div>
        )}
        <div className="wine-detail">
          <Star className="detail-icon star-icon" />
          {wine.myRating}/5
        </div>
      </div>

      {wine.store && (
        <p className="wine-store">
          <MapPin className="detail-icon" />
          {wine.store}
        </p>
      )}

      {wine.consumedLocation && (
        <div className="consumed-info">
          <p className="consumed-label">Consumed:</p>
          <p className="consumed-detail">{wine.consumedLocation}</p>
          <p className="consumed-detail">{wine.occasion}</p>
          <p className="consumed-detail">{new Date(wine.consumedDate).toLocaleDateString()}</p>
        </div>
      )}

      {wine.notes && (
        <p className="wine-notes">"{wine.notes}"</p>
      )}

      <div className="wine-actions">
        <div className="action-buttons">
          {showConsumeButton && wine.status === 'in_cellar' && (
            <button
              onClick={() => handleConsumeWine(wine.id)}
              className="consume-button"
            >
              Mark as Consumed
            </button>
          )}
          <button className="icon-button">
            <Edit3 className="action-icon" />
          </button>
        </div>
        <button
          onClick={() => handleDeleteWine(wine.id)}
          className="delete-button"
        >
          <Trash2 className="action-icon" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="app">
      {/* Header */}
      <div className="header">
        <div className="header-content">
          <div className="header-left">
            <Wine className="header-icon" />
            <h1 className="header-title">Wine Cellar</h1>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="add-wine-button"
          >
            <Plus className="button-icon" />
            <span>Add Wine</span>
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stats-content">
          <div className="stat">
            <p className="stat-number stat-purple">{inventoryWines.length}</p>
            <p className="stat-label">Bottles in Cellar</p>
          </div>
          <div className="stat">
            <p className="stat-number stat-green">${totalValue.toFixed(0)}</p>
            <p className="stat-label">Current Value</p>
          </div>
          <div className="stat">
            <p className="stat-number stat-blue">${totalPurchaseValue.toFixed(0)}</p>
            <p className="stat-label">Purchase Value</p>
          </div>
          <div className="stat">
            <p className="stat-number stat-orange">{consumedWines.length}</p>
            <p className="stat-label">Wines Consumed</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Navigation Tabs */}
        <div className="tabs">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`tab ${activeTab === 'inventory' ? 'tab-active' : ''}`}
          >
            Current Inventory ({inventoryWines.length})
          </button>
          <button
            onClick={() => setActiveTab('consumed')}
            className={`tab ${activeTab === 'consumed' ? 'tab-active' : ''}`}
          >
            Wine History ({consumedWines.length})
          </button>
        </div>

        {/* Search and Filter */}
        <div className="search-filter">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search wines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-container">
            <Filter className="filter-icon" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Wines</option>
              <option value="in_cellar">In Cellar</option>
              <option value="consumed">Consumed</option>
            </select>
          </div>
        </div>

        {/* Wine Grid */}
        <div className="wine-grid">
          {activeTab === 'inventory' &&
            inventoryWines.map(wine => (
              <WineCard key={wine.id} wine={wine} showConsumeButton={true} />
            ))
          }
          {activeTab === 'consumed' &&
            consumedWines.map(wine => (
              <WineCard key={wine.id} wine={wine} showConsumeButton={false} />
            ))
          }
        </div>

        {filteredWines.length === 0 && (
          <div className="empty-state">
            <Wine className="empty-icon" />
            <h3 className="empty-title">No wines found</h3>
            <p className="empty-text">
              {searchTerm ? 'Try adjusting your search terms' : 'Add your first wine to get started'}
            </p>
          </div>
        )}
      </div>

      {/* Add Wine Form Modal */}
      {showAddForm && (
        <AddWineForm 
          onAddWine={handleAddWine}
          onClose={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
};

export default WineInventoryApp;