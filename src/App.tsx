import { useEffect, useState } from "react";
interface SubscriptionItem {
  endpoint: string
  keys: {
    auth: string;
    p256dh: string
  }
}

const App = () => {
  const [subscriptions, setSubscriptions] = useState<Record<string,SubscriptionItem>>({});

  useEffect(() => {
    async function fetchSubscriptions() {
      const response = await fetch("http://localhost:8080/subscriptions"); 
      if (response.ok) {
        const data = await response.json();
        setSubscriptions(data);
      } else {
        console.error("Failed to fetch subscriptions");
      }
    }
    fetchSubscriptions();
  }, []);

  const handleNotifyAll = async () => {
    const response = await fetch("http://localhost:8080/notify", { method: "POST" });
    if (response.ok) {
      alert("Notifications sent to all subscriptions.");
    } else {
      alert("Failed to send notifications.");
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={handleNotifyAll}>Notify All</button>
      <h2>Subscriptions</h2>
      <ul>
        {Object.keys(subscriptions).map((userID, index) => (
          <li key={index}>
            <strong>Users:</strong> {userID}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
