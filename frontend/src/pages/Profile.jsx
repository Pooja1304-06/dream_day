import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();
  return (
    <div className="page narrow">
      <span className="mini-label">ACCOUNT</span>
      <h1>Your profile</h1>
      <div className="profile-card">
        <div className="profile-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
        <h2>{user?.name}</h2>
        <p>{user?.email}</p>
        <p>{user?.phone || "Phone not added"}</p>
        <span className="verified">✓ Email verified</span>
      </div>
    </div>
  );
}
