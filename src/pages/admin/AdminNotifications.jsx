
import { useState } from "react";
import {
  FaBell,
  FaBullhorn,
  FaClipboardCheck,
  FaBookOpen,
   FaCog,
  FaPaperPlane,
  FaUsers,
  FaUser,
  FaLink,
  FaCheckCircle,
  FaExclamationCircle,
  FaArrowLeft,
} from "react-icons/fa";

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const notificationTypes = [
  {
    value: "announcement",
    label: "Announcement",
    description: "General news and important updates",
    icon: FaBullhorn,
  },
  {
    value: "assignment",
    label: "Assignment",
    description: "Assignment instructions and reminders",
    icon: FaClipboardCheck,
  },
  {
    value: "course",
    label: "Course",
    description: "Learning materials and course updates",
    icon: FaBookOpen,
  },
  {
    value: "system",
    label: "System",
    description: "Account and platform notifications",
    icon: FaCog,
  },
];

export default function AdminNotifications() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("announcement");
  const [link, setLink] = useState("");
  const [recipientType, setRecipientType] = useState("all");
  const [recipientId, setRecipientId] = useState("");

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const selectedType = notificationTypes.find(
    (item) => item.value === type
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);

    if (!title.trim() || !message.trim()) {
      setFeedback({
        type: "error",
        message: "Please provide both a title and a message.",
      });
      return;
    }

    if (recipientType === "individual" && !recipientId.trim()) {
      setFeedback({
        type: "error",
        message: "Please enter the student's user ID.",
      });
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setFeedback({
        type: "error",
        message: "You are not logged in. Please sign in again.",
      });
      return;
    }

    const payload = {
      title: title.trim(),
      message: message.trim(),
      type,
      link: link.trim(),
      sendToAll: recipientType === "all",
    };

    if (recipientType === "individual") {
      payload.recipientId = recipientId.trim();
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/notifications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to send notification.");
      }

      setFeedback({
        type: "success",
        message: data.message || "Notification sent successfully!",
      });

      setTitle("");
      setMessage("");
      setLink("");
      setRecipientId("");
    } catch (error) {
      setFeedback({
        type: "error",
        message: error.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f7fb] text-slate-800">
      <div className="mx-auto max-w-7xl px-5 py-8 md:px-8">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#b58a3b]">
              YouthForge Administration
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-[#173b5f] md:text-4xl">
              Notifications
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Communicate important updates directly to your students.
            </p>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#173b5f] text-xl text-white shadow-lg shadow-blue-950/10">
            <FaBell />
          </div>
        </div>

        {/* Main content */}
        <div className="grid gap-7 lg:grid-cols-[1.5fr_0.85fr]">

          {/* Notification form */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-7">
              <h2 className="text-xl font-bold text-[#173b5f]">
                Create notification
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Compose your message and choose who should receive it.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Recipients */}
              <div>
                <label className="mb-3 block text-sm font-semibold text-slate-700">
                  Who should receive this notification?
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setRecipientType("all")}
                    className={`rounded-2xl border p-4 text-left transition ${
                      recipientType === "all"
                        ? "border-[#173b5f] bg-blue-50 ring-2 ring-[#173b5f]/10"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <FaUsers className="mb-3 text-xl text-[#173b5f]" />
                    <p className="font-bold text-slate-800">All students</p>
                    <p className="mt-1 text-xs text-slate-500">
                      Send to every eligible student.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRecipientType("individual")}
                    className={`rounded-2xl border p-4 text-left transition ${
                      recipientType === "individual"
                        ? "border-[#173b5f] bg-blue-50 ring-2 ring-[#173b5f]/10"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <FaUser className="mb-3 text-xl text-[#173b5f]" />
                    <p className="font-bold text-slate-800">One student</p>
                    <p className="mt-1 text-xs text-slate-500">
                      Send to a specific student.
                    </p>
                  </button>
                </div>

                {recipientType === "individual" && (
                  <div className="mt-4">
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Student User ID
                    </label>
                    <input
                      value={recipientId}
                      onChange={(e) => setRecipientId(e.target.value)}
                      placeholder="Enter student's MongoDB user ID"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#173b5f] focus:ring-2 focus:ring-[#173b5f]/10"
                    />
                  </div>
                )}
              </div>

              {/* Type */}
              <div>
                <label className="mb-3 block text-sm font-semibold text-slate-700">
                  Notification category
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                  {notificationTypes.map((item) => {
                    const Icon = item.icon;

                    return (
                      <button
                        type="button"
                        key={item.value}
                        onClick={() => setType(item.value)}
                        className={`flex items-start gap-3 rounded-xl border p-3 text-left transition ${
                          type === item.value
                            ? "border-[#173b5f] bg-blue-50"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#173b5f] shadow-sm">
                          <Icon />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">
                            {item.label}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {item.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Notification title
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={120}
                  placeholder="e.g. Welcome to YouthForge!"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#173b5f] focus:ring-2 focus:ring-[#173b5f]/10"
                />
                <p className="mt-1 text-right text-xs text-slate-400">
                  {title.length}/120
                </p>
              </div>

              {/* Message */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={1000}
                  rows={5}
                  placeholder="Write your notification message here..."
                  className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#173b5f] focus:ring-2 focus:ring-[#173b5f]/10"
                />
                <p className="mt-1 text-right text-xs text-slate-400">
                  {message.length}/1000
                </p>
              </div>

              {/* Optional link */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <FaLink className="text-slate-400" />
                  Optional destination link
                </label>
                <input
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="/assignments or /course"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#173b5f] focus:ring-2 focus:ring-[#173b5f]/10"
                />
                <p className="mt-2 text-xs text-slate-400">
                  Use a frontend route, such as /assignments.
                </p>
              </div>

              {/* Feedback */}
              {feedback && (
                <div
                  className={`flex items-start gap-3 rounded-xl p-4 text-sm ${
                    feedback.type === "success"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {feedback.type === "success" ? (
                    <FaCheckCircle className="mt-0.5 shrink-0" />
                  ) : (
                    <FaExclamationCircle className="mt-0.5 shrink-0" />
                  )}
                  <p>{feedback.message}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#173b5f] px-6 py-4 font-semibold text-white shadow-lg shadow-blue-950/10 transition hover:bg-[#214d77] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FaPaperPlane />
                {loading ? "Sending notification..." : "Send notification"}
              </button>
            </form>
          </div>

          {/* Preview */}
          <aside className="space-y-5">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#b58a3b]">
                  Live preview
                </p>
                <h2 className="mt-2 text-xl font-bold text-[#173b5f]">
                  Student notification
                </h2>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-[#f8fafc] p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#173b5f] text-white">
                    {selectedType && <selectedType.icon />}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#b58a3b]">
                      {selectedType?.label}
                    </p>
                    <h3 className="mt-1 break-words font-bold text-slate-800">
                      {title || "Your notification title"}
                    </h3>
                  </div>
                </div>

                <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">
                  {message || "Your notification message will appear here."}
                </p>

                {link && (
                  <div className="mt-4 border-t border-slate-200 pt-3 text-xs font-semibold text-[#173b5f]">
                    Destination: {link}
                  </div>
                )}

                <p className="mt-4 text-xs text-slate-400">
                  Just now · YouthForge
                </p>
              </div>

              <div className="mt-5 rounded-xl bg-blue-50 p-4">
                <p className="text-xs font-semibold text-[#173b5f]">
                  Recipient
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {recipientType === "all"
                    ? "All eligible students"
                    : "One selected student"}
                </p>
              </div>
            </div>

            <div className="rounded-3xl bg-[#173b5f] p-6 text-white">
              <FaBell className="mb-4 text-2xl text-[#d8b36a]" />
              <h3 className="text-lg font-bold">
                Stay connected with your students.
              </h3>
              <p className="mt-2 text-sm leading-6 text-blue-100">
                Use notifications to share important updates, assignment
                reminders, course information and announcements.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
