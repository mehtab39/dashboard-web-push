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

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleNotifyAll = async (
    title: string,
    message: string,
    actions: { action: string; title: string; icon: string }[]
  ) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/notify", {
        method: "POST",
        body: JSON.stringify({ title, message, actions }),
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        alert("Notifications sent to all subscriptions.");
      } else {
        alert("Failed to send notifications.");
      }
    } catch (error) {
      console.error("Error sending notifications to all:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotify = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const userid = event.currentTarget.dataset.userid;
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/notify-user", {
        method: "POST",
        body: JSON.stringify({ userid }),
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        alert(`Notification sent to user ${userid}`);
      } else {
        alert("Failed to send notification.");
      }
    } catch (error) {
      console.error("Error sending notification:", error);
    } finally {
      setLoading(false);
    }
  };

  const unsubscribe = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const userid = event.currentTarget.dataset.userid;
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

  return (
    <div>
      <h1>Dashboard</h1>
      <NotificationForm onSubmit={handleNotifyAll} loading={loading} />
      <h2>Subscriptions</h2>
      {loading ? (
        <p>Loading subscriptions...</p>
      ) : (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {Object.keys(subscriptions).length === 0 ? (
            <p>No subscriptions available</p>
          ) : (
            Object.keys(subscriptions).map((userID) => (
              <li key={userID} style={{ marginBottom: "15px" }}>
                <div className="user-item">
                  <p>
                    <strong>User:</strong> {userID}
                  </p>
                  <button onClick={handleNotify} data-userid={userID} disabled={loading}>
                    {loading ? "Notifying..." : "Notify"}
                  </button>
                  <button onClick={unsubscribe} data-userid={userID} disabled={loading}>
                    {loading ? "Removing..." : "Remove"}
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default App;
