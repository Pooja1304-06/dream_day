import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  ArrowRight,
  Heart,
  Sparkles,
  Camera,
  Utensils,
  Music,
  Flower2,
  Palette,
  Cake,
  Building2,
  SlidersHorizontal,
  Star
} from "lucide-react";

import "./VendorHub.css";

const categories = [
  { name: "All Vendors", icon: Sparkles },
  { name: "Catering", icon: Utensils },
  { name: "Photography", icon: Camera },
  { name: "DJ & Music", icon: Music },
  { name: "Decoration", icon: Flower2 },
  { name: "Makeup", icon: Palette },
  { name: "Venues", icon: Building2 },
  { name: "Cakes", icon: Cake }
];

// Demo records for the initial frontend.
// Replace these with MongoDB data in Phase 3.
const sampleVendors = [
  {
    _id: "demo-1",
    businessName: "Royal Feast Catering",
    category: "Catering",
    location: "Coimbatore",
    priceStartingFrom: 350,
    rating: 4.8,
    reviews: 124,
    description:
      "Traditional South Indian wedding menus and elegant buffet experiences.",
    image:
      "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=900&q=85",
    featured: true
  },
  {
    _id: "demo-2",
    businessName: "Ever After Photography",
    category: "Photography",
    location: "Coimbatore",
    priceStartingFrom: 15000,
    rating: 4.9,
    reviews: 86,
    description:
      "Candid wedding photography, cinematic films and timeless portraits.",
    image:
      "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=900&q=85",
    featured: true
  },
  {
    _id: "demo-3",
    businessName: "Rhythm Beats Events",
    category: "DJ & Music",
    location: "Chennai",
    priceStartingFrom: 12000,
    rating: 4.7,
    reviews: 65,
    description:
      "Professional DJs, party playlists, sound systems and lighting.",
    image:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=900&q=85",
    featured: false
  },
  {
    _id: "demo-4",
    businessName: "Blossom Wedding Decor",
    category: "Decoration",
    location: "Coimbatore",
    priceStartingFrom: 25000,
    rating: 4.8,
    reviews: 92,
    description:
      "Floral stages, elegant backdrops and personalized wedding decorations.",
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=85",
    featured: true
  },
  {
    _id: "demo-5",
    businessName: "Glow Bridal Studio",
    category: "Makeup",
    location: "Chennai",
    priceStartingFrom: 8000,
    rating: 4.6,
    reviews: 54,
    description:
      "Bridal makeup, hairstyling and occasion-ready beauty packages.",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=85",
    featured: false
  },
  {
    _id: "demo-6",
    businessName: "The Grand Garden Hall",
    category: "Venues",
    location: "Coimbatore",
    priceStartingFrom: 50000,
    rating: 4.7,
    reviews: 73,
    description:
      "A spacious event setting for weddings, receptions and celebrations.",
    image:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=900&q=85",
    featured: false
  },
  {
    _id: "demo-7",
    businessName: "Sweet Moments Cakes",
    category: "Cakes",
    location: "Chennai",
    priceStartingFrom: 1500,
    rating: 4.8,
    reviews: 41,
    description:
      "Custom-designed cakes for weddings, birthdays and special occasions.",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=85",
    featured: false
  },
  {
    _id: "demo-8",
    businessName: "Golden Hour Photography",
    category: "Photography",
    location: "Chennai",
    priceStartingFrom: 18000,
    rating: 4.9,
    reviews: 103,
    description:
      "Creative event photography and cinematic memories for every occasion.",
    image:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=85",
    featured: true
  }
];

function formatPrice(price) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(price);
}

export default function VendorHub() {
  const [selectedCategory, setSelectedCategory] =
    useState("All Vendors");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("All Locations");
  const [sortBy, setSortBy] = useState("featured");

  const [favourites, setFavourites] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("dreamday-vendor-favourites") || "[]"
      );
    } catch {
      return [];
    }
  });

  const filteredVendors = useMemo(() => {
    let result = sampleVendors.filter((vendor) => {
      const matchesCategory =
        selectedCategory === "All Vendors" ||
        vendor.category === selectedCategory;

      const searchText =
        `${vendor.businessName} ${vendor.category} ${vendor.location} ${vendor.description}`
          .toLowerCase();

      const matchesSearch = searchText.includes(
        searchTerm.trim().toLowerCase()
      );

      const matchesCity =
        selectedCity === "All Locations" ||
        vendor.location === selectedCity;

      return matchesCategory && matchesSearch && matchesCity;
    });

    if (sortBy === "price-low") {
      result.sort(
        (a, b) => a.priceStartingFrom - b.priceStartingFrom
      );
    } else if (sortBy === "price-high") {
      result.sort(
        (a, b) => b.priceStartingFrom - a.priceStartingFrom
      );
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else {
      result.sort(
        (a, b) => Number(b.featured) - Number(a.featured)
      );
    }

    return result;
  }, [selectedCategory, searchTerm, selectedCity, sortBy]);

  function toggleFavourite(vendorId) {
    setFavourites((previous) => {
      const updated = previous.includes(vendorId)
        ? previous.filter((id) => id !== vendorId)
        : [...previous, vendorId];

      localStorage.setItem(
        "dreamday-vendor-favourites",
        JSON.stringify(updated)
      );

      return updated;
    });
  }

  return (
    <main className="vendor-hub">
      <section className="vendor-hero">
        <div className="vendor-hero-overlay" />

        <div className="vendor-hero-content">
          <span className="vendor-eyebrow">
            <Sparkles size={15} />
            THE DREAM DAY COLLECTION
          </span>

          <h1>
            Meet Your
            <br />
            <span>Dream Team.</span>
          </h1>

          <p>
            From unforgettable photographs to beautiful decorations,
            discover the professionals who will make your celebration
            extraordinary.
          </p>

          <a href="#vendor-list" className="vendor-hero-button">
            Explore Vendors <ArrowRight size={17} />
          </a>

          <div className="vendor-hero-note">
            <span className="vendor-hero-dot" />
            Explore services for your next celebration
          </div>
        </div>

        <div className="vendor-hero-decoration">
          <div className="vendor-hero-glass">
            <span>YOUR DAY</span>
            <strong>Your way.</strong>
            <p>Every detail, beautifully planned.</p>
            <div className="vendor-mini-stars">✦ ✧ ✦</div>
          </div>
        </div>
      </section>

      <section className="vendor-main">
        <div className="vendor-heading">
          <div>
            <span className="vendor-section-label">
              YOUR CELEBRATION STARTS HERE
            </span>

            <h2>
              Find the perfect <span>professionals</span>
            </h2>

            <p>
              Explore event specialists and discover the right team
              for your special day.
            </p>
          </div>

          <div className="vendor-result-count">
            <Sparkles size={17} />
            <span>
              {filteredVendors.length} vendors to explore
            </span>
          </div>
        </div>

        <div className="vendor-category-list">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <button
                type="button"
                key={category.name}
                className={`vendor-category ${
                  selectedCategory === category.name
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setSelectedCategory(category.name)
                }
              >
                <Icon size={20} strokeWidth={1.7} />
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>

        <div className="vendor-filter-panel" id="vendor-list">
          <div className="vendor-search-box">
            <Search size={19} />

            <input
              type="search"
              placeholder="Search vendors, services or locations..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              aria-label="Search vendors"
            />
          </div>

          <div className="vendor-filter-select">
            <MapPin size={17} />

            <select
              value={selectedCity}
              onChange={(event) =>
                setSelectedCity(event.target.value)
              }
              aria-label="Filter by location"
            >
              <option>All Locations</option>
              <option>Coimbatore</option>
              <option>Chennai</option>
            </select>
          </div>

          <div className="vendor-filter-select">
            <SlidersHorizontal size={17} />

            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              aria-label="Sort vendors"
            >
              <option value="featured">Featured</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="vendor-card-grid">
          {filteredVendors.map((vendor, index) => (
            <article
              className="vendor-card"
              key={vendor._id}
              style={{ "--card-index": index }}
            >
              <div className="vendor-card-image-wrap">
                <img
                  className="vendor-card-image"
                  src={vendor.image}
                  alt={vendor.businessName}
                  loading="lazy"
                />

                {vendor.featured && (
                  <span className="vendor-featured-badge">
                    <Sparkles size={12} />
                    Featured
                  </span>
                )}

                <button
                  type="button"
                  className={`vendor-favourite ${
                    favourites.includes(vendor._id)
                      ? "saved"
                      : ""
                  }`}
                  onClick={() => toggleFavourite(vendor._id)}
                  aria-label={`${
                    favourites.includes(vendor._id)
                      ? "Remove"
                      : "Save"
                  } ${vendor.businessName}`}
                  aria-pressed={favourites.includes(vendor._id)}
                >
                  <Heart
                    size={19}
                    fill={
                      favourites.includes(vendor._id)
                        ? "currentColor"
                        : "none"
                    }
                  />
                </button>

                <span className="vendor-image-category">
                  {vendor.category}
                </span>
              </div>

              <div className="vendor-card-body">
                <div className="vendor-card-topline">
                  <span className="vendor-location">
                    <MapPin size={14} />
                    {vendor.location}
                  </span>

                  <span className="vendor-rating">
                    <Star size={14} fill="currentColor" />
                    {vendor.rating}
                    <span>({vendor.reviews})</span>
                  </span>
                </div>

                <h3>{vendor.businessName}</h3>

                <p className="vendor-card-description">
                  {vendor.description}
                </p>

                <div className="vendor-card-bottom">
                  <div className="vendor-price">
                    <span>Starting from</span>
                    <strong>
                      {formatPrice(vendor.priceStartingFrom)}
                    </strong>
                  </div>

                  <Link
                    to={`/vendors/${vendor._id}`}
                    className="vendor-view-button"
                  >
                    View <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredVendors.length === 0 && (
          <div className="vendor-empty-state">
            <Search size={35} />

            <h3>No vendors found</h3>

            <p>
              Try another search term or choose a different category.
            </p>

            <button
              type="button"
              onClick={() => {
                setSelectedCategory("All Vendors");
                setSearchTerm("");
                setSelectedCity("All Locations");
                setSortBy("featured");
              }}
            >
              Clear Filters
            </button>
          </div>
        )}

        <section className="vendor-join-banner">
          <div className="vendor-join-icon">
            <Sparkles size={26} />
          </div>

          <div>
            <span>ARE YOU AN EVENT PROFESSIONAL?</span>
            <h2>Let your work find its audience.</h2>
            <p>
              Showcase your services and connect with people
              planning their special celebrations.
            </p>
          </div>

          <Link to="/vendor-register" className="vendor-join-button">
            Join as a Vendor <ArrowRight size={17} />
          </Link>
        </section>
      </section>
    </main>
  );
}