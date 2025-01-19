import { useState } from "react";

interface NotificationAction {
  action: string;
  title: string;
  icon: string;
}

interface NotificationFormProps {
  onSubmit: (title: string, message: string, actions: NotificationAction[]) => void;
  loading: boolean;
  disabled: boolean
}

const NotificationForm: React.FC<NotificationFormProps> = ({ onSubmit, loading, disabled }) => {
  const [title, setTitle] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [actions, setActions] = useState<NotificationAction[]>([]);

  const handleAddAction = () => {
    setActions((prevActions) => [
      ...prevActions,
      { action: "", title: "", icon: "" },
    ]);
  };

  const handleActionChange = (
    index: number,
    field: keyof NotificationAction,
    value: string
  ) => {
    const updatedActions = actions.map((action, i) =>
      i === index ? { ...action, [field]: value } : action
    );
    setActions(updatedActions);
  };

  const handleRemoveAction = (index: number) => {
    setActions(actions.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(title, message, actions);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Send a Notification</h3>
      <label>
        Title:
        <input
          type="text"
          placeholder="Enter your title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ display: "block", marginBottom: "10px" }}
        />
      </label>
      <label>
        Message:
        <textarea
          placeholder="Enter your custom message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          cols={50}
          style={{ display: "block", marginBottom: "10px" }}
        />
      </label>
      <h4>Actions (optional)</h4>
      {actions.map((action, index) => (
        <div key={index} style={{ marginBottom: "10px" }}>
          <label>
            Action Key:
            <input
              type="text"
              placeholder="Enter action key"
              value={action.action}
              onChange={(e) =>
                handleActionChange(index, "action", e.target.value)
              }
              style={{ marginRight: "10px" }}
            />
          </label>
          <label>
            Title:
            <input
              type="text"
              placeholder="Enter action title"
              value={action.title}
              onChange={(e) =>
                handleActionChange(index, "title", e.target.value)
              }
              style={{ marginRight: "10px" }}
            />
          </label>
          <label>
            Icon URL:
            <input
              type="text"
              placeholder="Enter icon URL"
              value={action.icon}
              onChange={(e) =>
                handleActionChange(index, "icon", e.target.value)
              }
            />
          </label>
          <button type="button" onClick={() => handleRemoveAction(index)}>
            Remove Action
          </button>
        </div>
      ))}
      <button type="button" onClick={handleAddAction}>
        Add Action
      </button>
      <br />
      <button type="submit" disabled={loading || disabled}>
        {loading ? "Sending..." : "Notify selected users"}
      </button>
    </form>
  );
};

export default NotificationForm;
