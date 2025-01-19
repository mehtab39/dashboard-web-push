import { useEffect, useState } from "react";
import NotificationForm from "./components/NotificationForm";

interface SubscriptionItem {
  endpoint: string;
  keys: {
    auth: string;
    p256dh: string;
  };
}

const App = () => {
  const [subscriptions, setSubscriptions] = useState<Record<string, SubscriptionItem>>({});
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  async function fetchSubscriptions() {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/subscriptions");
      if (response.ok) {
        const data = await response.json();
        setSubscriptions(data);
      } else {
        console.error("Failed to fetch subscriptions");
      }
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleSelectAll = () => {
    const allUsers = Object.keys(subscriptions);
    setSelectedUsers(prev => {
      if(prev.length === allUsers.length){
        return []
      }
      return allUsers;
    });
  };

  const handleNotifySelected = async (
    title: string,
    message: string,
    actions: { action: string; title: string; icon: string }[]
  ) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/notify", {
        method: "POST",
        body: JSON.stringify({
          users: selectedUsers,
          title,
          message,
          actions,
        }),
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        alert("Notifications sent to selected users.");
      } else {
        alert("Failed to send notifications.");
      }
    } catch (error) {
      console.error("Error sending notifications to selected users:", error);
    } finally {
      setLoading(false);
    }
  };

  const unsubscribe = async (userid: string) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/unsubscribe", {
        method: "POST",
        body: JSON.stringify({ userid }),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        alert("Failed to unsubscribe.");
      } else {
        fetchSubscriptions(); // Refresh subscriptions after successful removal
      }
    } catch (error) {
      console.error("Error unsubscribing:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserSelection = (userid: string) => {
    if (selectedUsers.includes(userid)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userid));
    } else {
      setSelectedUsers([...selectedUsers, userid]);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <h2>Subscriptions</h2>
      {loading ? (
        <p>Loading subscriptions...</p>
      ) : (
        <div>
          {Object.keys(subscriptions).length === 0 ? (
            <p>No subscriptions available</p>
          ) : (
            <div>
              <button onClick={handleSelectAll} disabled={loading}>
                Select All
              </button>
              <ul style={{ listStyleType: "none", padding: 0 }}>
                {Object.keys(subscriptions).map((userID) => (
                  <li key={userID} style={{ marginBottom: "15px" }}>
                    <div className="user-item">
                      <p>
                        <strong>User:</strong> {userID}
                      </p>
                      <button onClick={() => unsubscribe(userID)} disabled={loading}>
                        {loading ? "Removing..." : "Remove"}
                      </button>
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(userID)}
                        onChange={() => toggleUserSelection(userID)}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      <NotificationForm onSubmit={handleNotifySelected} loading={loading} disabled={selectedUsers.length===0} />
    </div>
  );
};

export default App;
