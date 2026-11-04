
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBell,
  FaBullhorn,
  FaClipboardCheck,
  FaBookOpen,
  FaCog,
  FaCheck,
  FaCheckDouble,
  FaTrash,
  FaInbox,
  FaArrowLeft,
  FaExternalLinkAlt,
  FaRedo,
} from "react-icons/fa";

const API_URL = "http://localhost:8000/api";

const notificationStyles = {
  announcement: {
    icon: FaBullhorn,
    color: "text-amber-600",
    background: "bg-amber-50",
    label: "Announcement",
  },
  assignment: {
    icon: FaClipboardCheck,
    color: "text-blue-600",
    background: "bg-blue-50",
    label: "Assignment",
  },
  course: {
    icon: FaBookOpen,
    color: "text-violet-600",
    background: "bg-violet-50",
    label: "Course",
  },
  system: {
    icon: FaCog,
    color: "text-slate-600",
    background: "bg-slate-100",
    label: "System",
  },
};

const formatDate = (date) => {
  if (!date) return "";

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) return "";

  const now = new Date();
  const diff = now - value;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1 && diff >= 0) return "Just now";
  if (minutes < 60 && diff >= 0) return `${minutes}m ago`;
  if (hours < 24 && diff >= 0) return `${hours}h ago`;
  if (days < 7 && diff >= 0) return `${days}d ago`;

  return value.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function Notifications() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState("");

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.isRead).length,
    [notifications]
  );

  const readCount = notifications.length - unreadCount;

  const filteredNotifications = useMemo(() => {
    if (filter === "unread") {
      return notifications.filter((item) => !item.isRead);
    }

    if (filter === "read") {
      return notifications.filter((item) => item.isRead);
    }

    return notifications;
  }, [notifications, filter]);

  const fetchNotifications = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please log in to view your notifications.");
      setLoading(false);
      return;
    }

    try {
      setError("");

      const response = await fetch(`${API_URL}/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not load notifications.");
      }

      setNotifications(data.notifications || []);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (id) => {
    const token = localStorage.getItem("token");

    try {
      setActionLoading(id);

      const response = await fetch(
        `${API_URL}/notifications/${id}/read`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to mark as read.");
      }

      setNotifications((previous) =>
        previous.map((item) =>
          item._id === id
            ? { ...item, isRead: true, readAt: new Date() }
            : item
        )
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading("");
    }
  };

  const markAllAsRead = async () => {
    const token = localStorage.getItem("token");

    try {
      setActionLoading("all");

      const response = await fetch(
        `${API_URL}/notifications/read-all`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update notifications.");
      }

      setNotifications((previous) =>
        previous.map((item) => ({
          ...item,
          isRead: true,
          readAt: item.readAt || new Date(),
        }))
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading("");
    }
  };

  const deleteNotification = async (id) => {
    const token = localStorage.getItem("token");

    try {
      setActionLoading(id);

      const response = await fetch(
        `${API_URL}/notifications/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete notification.");
      }

      setNotifications((previous) =>
        previous.filter((item) => item._id !== id)
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading("");
    }
  };

  const openNotification = async (item) => {
    if (!item.isRead) {
      await markAsRead(item._id);
    }

    if (item.link) {
      if (/^https?:\/\//i.test(item.link)) {
        window.location.assign(item.link);
      } else {
        navigate(item.link.startsWith("/") ? item.link : `/${item.link}`);
      }
    }
  };

  const filters = [
    { value: "all", label: "All", count: notifications.length },
    { value: "unread", label: "Unread", count: unreadCount },
    { value: "read", label: "Read", count: readCount },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FB]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Back navigation */}
        <button
          onClick={() => navigate(-1)}
          className="mb-7 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[#173B5F]"
        >
          <FaArrowLeft />
          Go back
        </button>

        {/* Page heading */}
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#B58A3B]">
              Your activity
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-[#173B5F] md:text-4xl">
              Notifications
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Stay updated on announcements, assignments and your learning journey.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchNotifications}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-[#173B5F] hover:text-[#173B5F] disabled:opacity-50"
            >
              <FaRedo />
              Refresh
            </button>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                disabled={actionLoading === "all"}
                className="flex items-center gap-2 rounded-xl bg-[#173B5F] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#214D77] disabled:opacity-50"
              >
                <FaCheckDouble />
                <span className="hidden sm:inline">Mark all read</span>
                <span className="sm:hidden">Read all</span>
              </button>
            )}
          </div>
        </div>

        {/* Statistics */}
        <div className="mb-7 grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-slate-500">All notifications</p>
            <p className="mt-2 text-2xl font-bold text-[#173B5F]">
              {notifications.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-slate-500">Unread</p>
            <p className="mt-2 text-2xl font-bold text-[#B58A3B]">
              {unreadCount}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-slate-500">Read</p>
            <p className="mt-2 text-2xl font-bold text-slate-700">
              {readCount}
            </p>
          </div>
        </div>

        {/* Notification list */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          {/* Filters */}
          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:px-7">
            <div>
              <h2 className="font-bold text-[#173B5F]">
                Your inbox
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Your latest updates from YouthForge
              </p>
            </div>

            <div className="flex w-full gap-1 rounded-xl bg-slate-100 p-1 sm:w-auto">
              {filters.map((item) => (
                <button
                  key={item.value}
                  onClick={() => setFilter(item.value)}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition sm:flex-none ${
                    filter === item.value
                      ? "bg-white text-[#173B5F] shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {item.label}
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                      filter === item.value
                        ? "bg-[#173B5F] text-white"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {item.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="m-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
              {error}
              <button
                onClick={fetchNotifications}
                className="ml-2 font-bold underline"
              >
                Try again
              </button>
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-[#173B5F]" />
              <p className="mt-4 text-sm text-slate-500">
                Loading your notifications...
              </p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-5 py-20 text-center">
              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100">
                <FaInbox className="text-3xl text-slate-400" />
              </div>

              <h3 className="text-lg font-bold text-[#173B5F]">
                {filter === "unread"
                  ? "You're all caught up!"
                  : filter === "read"
                  ? "No read notifications yet"
                  : "Your inbox is empty"}
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                {filter === "unread"
                  ? "There are no unread messages. Enjoy your learning!"
                  : "When YouthForge sends you updates, they'll appear here."}
              </p>

              {filter !== "all" && (
                <button
                  onClick={() => setFilter("all")}
                  className="mt-5 text-sm font-bold text-[#173B5F] hover:underline"
                >
                  View all notifications
                </button>
              )}
            </div>
          ) : (
            <div>
              {filteredNotifications.map((item) => {
                const style =
                  notificationStyles[item.type] ||
                  notificationStyles.system;

                const Icon = style.icon;
                const isBusy = actionLoading === item._id;

                return (
                  <div
                    key={item._id}
                    className={`group relative border-b border-slate-100 p-5 transition last:border-0 sm:px-7 ${
                      !item.isRead
                        ? "bg-blue-50/40"
                        : "bg-white hover:bg-slate-50/70"
                    }`}
                  >
                    <div className="flex items-start gap-3 sm:gap-5">

                      {/* Icon */}
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl sm:h-12 sm:w-12 ${style.background} ${style.color}`}
                      >
                        <Icon className="text-lg" />
                      </div>

                      {/* Content */}
                      <div
                        onClick={() => openNotification(item)}
                        className={`min-w-0 flex-1 ${
                          item.link ? "cursor-pointer" : ""
                        }`}
                      >
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            {style.label}
                          </span>

                          {!item.isRead && (
                            <span className="h-2 w-2 rounded-full bg-blue-600" />
                          )}
                        </div>

                        <h3
                          className={`text-sm sm:text-base ${
                            item.isRead
                              ? "font-semibold text-slate-700"
                              : "font-bold text-[#173B5F]"
                          }`}
                        >
                          {item.title}
                        </h3>

                        <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-slate-500">
                          {item.message}
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                          <span>{formatDate(item.createdAt)}</span>

                          {item.link && (
                            <span className="flex items-center gap-1 font-semibold text-[#173B5F]">
                              View details
                              <FaExternalLinkAlt className="text-[9px]" />
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex shrink-0 items-center gap-1">
                        {!item.isRead && (
                          <button
                            title="Mark as read"
                            disabled={isBusy}
                            onClick={() => markAsRead(item._id)}
                            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-emerald-50 hover:text-emerald-600 disabled:opacity-50"
                          >
                            <FaCheck />
                          </button>
                        )}

                        <button
                          title="Delete notification"
                          disabled={isBusy}
                          onClick={() => deleteNotification(item._id)}
                          className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {!loading && notifications.length > 0 && (
          <p className="mt-6 text-center text-xs text-slate-400">
            You're all up to date with your YouthForge activity.
          </p>
        )}
      </div>
    </div>
  );
}
