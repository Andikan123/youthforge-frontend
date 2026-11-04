import { useEffect, useState, useCallback, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  FaBarsStaggered,
  FaRegCircleUser,
  FaBell,
  FaArrowRightFromBracket,
  FaBookOpen,
  FaClipboardCheck,
  FaBullhorn,
  FaGear,
  FaCheckDouble,
  FaArrowRight,
  FaXmark,
} from "react-icons/fa6";

const API_URL = "http://localhost:8000/api";

const Navbar = () => {
  const navigate = useNavigate();
  const notificationRef = useRef(null);

  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Notification states
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const navLinks = [
    { to: "/", label: "Home", end: true },
    { to: "/about", label: "About" },
    { to: "/courses", label: "Courses" },
  ];

  // Fetch logged-in user
  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      setLoadingUser(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setNotifications([]);
        setUnreadCount(0);
        return;
      }

      if (!response.ok) {
        throw new Error("Could not retrieve user information");
      }

      const data = await response.json();
      setUser(data.user || data);
    } catch (error) {
      console.error("User authentication error:", error);
    } finally {
      setLoadingUser(false);
    }
  }, []);

  // Fetch notifications from backend
  const fetchNotifications = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token || !user) return;

    setLoadingNotifications(true);

    try {
      const [notificationResponse, countResponse] = await Promise.all([
        fetch(`${API_URL}/notifications`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),

        fetch(`${API_URL}/notifications/unread-count`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      if (!notificationResponse.ok || !countResponse.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const notificationData = await notificationResponse.json();
      const countData = await countResponse.json();

      setNotifications(notificationData.notifications || []);
      setUnreadCount(countData.unreadCount || 0);
    } catch (error) {
      console.error("Notification error:", error);
    } finally {
      setLoadingNotifications(false);
    }
  }, [user]);

  // Initial authentication and navbar events
  useEffect(() => {
    fetchUser();

    window.addEventListener("authChanged", fetchUser);
    window.addEventListener("storage", fetchUser);

    return () => {
      window.removeEventListener("authChanged", fetchUser);
      window.removeEventListener("storage", fetchUser);
    };
  }, [fetchUser]);

  // Fetch notifications when user is authenticated
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    fetchNotifications();

    // Refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);

    return () => clearInterval(interval);
  }, [user, fetchNotifications]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // Sign out
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setNotifications([]);
    setUnreadCount(0);
    setNotificationOpen(false);

    window.dispatchEvent(new Event("authChanged"));

    navigate("/login", { replace: true });
  };

  // Mark individual notification as read
  const markAsRead = async (notificationId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${API_URL}/notifications/${notificationId}/read`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Could not mark notification as read");
      }

      setNotifications((previous) =>
        previous.map((notification) =>
          notification._id === notificationId
            ? { ...notification, isRead: true }
            : notification,
        ),
      );

      setUnreadCount((previous) => Math.max(0, previous - 1));
    } catch (error) {
      console.error("Mark as read error:", error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_URL}/notifications/read-all`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Could not mark notifications as read");
      }

      setNotifications((previous) =>
        previous.map((notification) => ({
          ...notification,
          isRead: true,
        })),
      );

      setUnreadCount(0);
    } catch (error) {
      console.error("Mark all as read error:", error);
    }
  };

  // Open notification and navigate
  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }

    setNotificationOpen(false);

    if (notification.link) {
      navigate(notification.link);
    } else {
      navigate("/notifications");
    }
  };

  // Notification icons
  const getNotificationIcon = (type) => {
    switch (type) {
      case "assignment":
        return <FaClipboardCheck />;

      case "course":
        return <FaBookOpen />;

      case "announcement":
        return <FaBullhorn />;

      default:
        return <FaGear />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "assignment":
        return "bg-emerald-500/10 text-emerald-400";

      case "course":
        return "bg-violet-500/10 text-violet-400";

      case "announcement":
        return "bg-amber-500/10 text-amber-400";

      default:
        return "bg-sky-500/10 text-sky-400";
    }
  };

  // Time formatting
  const timeAgo = (date) => {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);

    if (!Number.isFinite(seconds) || seconds < 0) return "Just now";
    if (seconds < 60) return "Just now";

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;

    return new Date(date).toLocaleDateString();
  };

  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.name ||
    user?.fullName ||
    user?.username ||
    user?.email?.split("@")[0] ||
    "Student";

  const userInitial = displayName.charAt(0).toUpperCase();

  return (
    <nav className=" top-0 z-50 border-b border-white/[0.08] bg-[#0B0D1A]/90 text-white shadow-[0_8px_40px_rgba(0,0,0,0.15)] backdrop-blur-2xl fixed top-0 left-0 z-50 w-full ">
      <div className="navbar mx-auto min-h-[76px] max-w-7xl px-5 sm:px-8">
        {/* BRAND */}
        <div className="navbar-start">
          <NavLink to="/" className="group flex flex-col leading-tight">
            <span className="text-[25px] font-bold tracking-[-1.5px] text-white">
              Youth
              <span className="text-violet-400 transition-colors duration-300 group-hover:text-violet-300">
                Forge
              </span>
              <span className="ml-0.5 text-violet-400">.</span>
            </span>

            <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[2px] text-slate-300">
              Christ Embassy
            </span>
          </NavLink>
        </div>

        {/* DESKTOP NAVIGATION */}
        <div className="navbar-center hidden lg:flex">
          <ul className="flex items-center gap-9">
            {navLinks.map(({ to, label, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `relative py-2 text-[13px] font-medium tracking-wide transition-colors duration-200 ${
                      isActive ? "text-white" : "text-white/50 hover:text-white"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {label}
                      <span
                        className={`absolute -bottom-1 left-0 h-[2px] rounded-full bg-violet-400 transition-all duration-300 ${
                          isActive ? "w-full" : "w-0"
                        }`}
                      />
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* ACTIONS */}
        <div className="navbar-end gap-3">
          {!loadingUser && (
            <>
              {!user ? (
                <>
                  <NavLink
                    to="/login"
                    className="hidden px-3 py-2 text-[13px] font-medium text-white/60 transition-colors hover:text-white sm:inline-flex"
                  >
                    Log in
                  </NavLink>

                  <NavLink
                    to="/register"
                    className="group relative hidden items-center justify-center overflow-hidden rounded-lg bg-violet-500 px-5 py-2.5 text-[13px] font-semibold text-white shadow-[0_0_24px_rgba(139,92,246,0.18)] transition-all duration-300 hover:bg-violet-400 sm:inline-flex"
                  >
                    Join YouthForge
                    <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                      ↗
                    </span>
                  </NavLink>
                </>
              ) : (
                <>
                  {/* USER WELCOME */}
                  <div className="hidden items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 transition hover:border-violet-400/30 hover:bg-violet-500/[0.08] sm:flex">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/20 text-sm font-bold text-violet-300">
                      {userInitial}
                    </span>

                    <div className="flex flex-col leading-tight">
                      <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-white/40">
                        Welcome back
                      </span>

                      <span className="max-w-[130px] truncate text-sm font-semibold text-white">
                        {displayName}
                      </span>
                    </div>
                  </div>

                  {/* PROFILE */}
                  <NavLink
                    to="/dashboard/profile"
                    aria-label="My profile"
                    title="My profile"
                    className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white text-slate-600 transition hover:border-violet-400"
                  >
                    {user?.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={`${displayName}'s profile`}
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <FaRegCircleUser className="text-2xl" />
                    )}
                  </NavLink>

                  {/* SIGN OUT */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    aria-label="Sign out"
                    title="Sign out"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/70 transition hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-400"
                  >
                    <FaArrowRightFromBracket className="text-lg" />
                  </button>
                </>
              )}
            </>
          )}

          {/* NOTIFICATION DROPDOWN */}
          {!loadingUser && user && (
            <div className="relative" ref={notificationRef}>
              {/* BELL BUTTON */}
              <button
                type="button"
                onClick={() => {
                  const nextOpen = !notificationOpen;
                  setNotificationOpen(nextOpen);

                  if (nextOpen) {
                    fetchNotifications();
                  }
                }}
                aria-label="Notifications"
                aria-expanded={notificationOpen}
                className={`relative flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-200 ${
                  notificationOpen
                    ? "border-violet-400/50 bg-violet-500/20 text-violet-300"
                    : "border-white/10 bg-white/[0.05] text-white/70 hover:border-violet-400/40 hover:bg-violet-500/10 hover:text-violet-300"
                }`}
              >
                <FaBell className="text-lg" />

                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-[#0B0D1A]">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </button>

              {/* DROPDOWN PANEL */}
              {notificationOpen && (
                <div className="absolute right-0 top-[calc(100%+16px)] z-[100] w-[calc(100vw-32px)] max-w-[390px] overflow-hidden rounded-2xl border border-white/10 bg-[#111426] shadow-[0_25px_80px_rgba(0,0,0,0.55)] animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* HEADER */}
                  <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4">
                    <div>
                      <h3 className="text-base font-bold text-white">
                        Notifications
                      </h3>

                      <p className="mt-0.5 text-[11px] text-white/40">
                        Stay updated with YouthForge
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setNotificationOpen(false)}
                      aria-label="Close notifications"
                      className="flex h-8 w-8 items-center justify-center rounded-full text-white/40 transition hover:bg-white/10 hover:text-white"
                    >
                      <FaXmark />
                    </button>
                  </div>

                  {/* NOTIFICATION ACTIONS */}
                  <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3">
                    <span className="text-xs font-medium text-white/50">
                      {unreadCount} unread
                    </span>

                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={markAllAsRead}
                        className="flex items-center gap-1.5 text-[11px] font-semibold text-violet-400 transition hover:text-violet-300"
                      >
                        <FaCheckDouble />
                        Mark all as read
                      </button>
                    )}
                  </div>

                  {/* NOTIFICATION LIST */}
                  <div className="max-h-[390px] overflow-y-auto">
                    {loadingNotifications && notifications.length === 0 ? (
                      <div className="flex flex-col items-center gap-3 py-12">
                        <span className="loading loading-spinner loading-md text-violet-400"></span>
                        <p className="text-xs text-white/40">
                          Loading notifications...
                        </p>
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="flex flex-col items-center px-6 py-12 text-center">
                        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white/[0.04] text-white/30">
                          <FaBell className="text-xl" />
                        </div>

                        <h4 className="text-sm font-semibold text-white">
                          You're all caught up!
                        </h4>

                        <p className="mt-1 max-w-[220px] text-xs leading-relaxed text-white/40">
                          When something important happens, you'll find it here.
                        </p>
                      </div>
                    ) : (
                      notifications.slice(0, 8).map((notification) => (
                        <button
                          type="button"
                          key={notification._id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`group flex w-full items-start gap-3 border-b border-white/[0.05] px-5 py-4 text-left transition hover:bg-white/[0.04] ${
                            !notification.isRead ? "bg-violet-500/[0.035]" : ""
                          }`}
                        >
                          {/* TYPE ICON */}
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm ${getNotificationColor(
                              notification.type,
                            )}`}
                          >
                            {getNotificationIcon(notification.type)}
                          </div>

                          {/* CONTENT */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <h4
                                className={`text-[13px] leading-snug ${
                                  notification.isRead
                                    ? "font-medium text-white/70"
                                    : "font-bold text-white"
                                }`}
                              >
                                {notification.title}
                              </h4>

                              {!notification.isRead && (
                                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-violet-400" />
                              )}
                            </div>

                            <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-white/45">
                              {notification.message}
                            </p>

                            <span className="mt-2 block text-[10px] text-white/30">
                              {timeAgo(notification.createdAt)}
                            </span>
                          </div>

                          <FaArrowRight className="mt-3 shrink-0 text-[10px] text-white/0 transition group-hover:translate-x-1 group-hover:text-violet-400" />
                        </button>
                      ))
                    )}
                  </div>

                  {/* FOOTER */}
                  <button
                    type="button"
                    onClick={() => {
                      setNotificationOpen(false);
                      navigate("/notifications");
                    }}
                    className="flex w-full items-center justify-center gap-2 border-t border-white/[0.08] bg-white/[0.02] px-5 py-4 text-xs font-semibold text-violet-400 transition hover:bg-violet-500/[0.08] hover:text-violet-300"
                  >
                    View all notifications
                    <FaArrowRight />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* MOBILE MENU */}
          <div className="dropdown dropdown-end lg:hidden">
            <button
              type="button"
              tabIndex={0}
              aria-label="Open navigation menu"
              className="btn btn-ghost btn-square rounded-lg border border-white/10 bg-white/[0.03] text-white hover:border-violet-400/40 hover:bg-white/[0.06]"
            >
              <FaBarsStaggered className="h-5 w-5" />
            </button>

            <ul
              tabIndex={0}
              className="menu dropdown-content z-[60] mt-4 w-60 gap-1 rounded-xl border border-white/10 bg-[#111426] p-3 text-white shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
            >
              {user && (
                <li className="mb-2 border-b border-white/10 pb-3">
                  <span className="font-semibold text-violet-300">
                    Hi, {displayName}
                  </span>
                </li>
              )}

              {navLinks.map(({ to, label, end }) => (
                <li key={to}>
                  <NavLink to={to} end={end}>
                    {label}
                  </NavLink>
                </li>
              ))}

              {!user ? (
                <>
                  <li>
                    <NavLink to="/login">Log in</NavLink>
                  </li>

                  <li className="mt-2 border-t border-white/10 pt-2">
                    <NavLink
                      to="/register"
                      className="!bg-violet-500 !font-semibold !text-white hover:!bg-violet-400"
                    >
                      Join YouthForge ↗
                    </NavLink>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <NavLink to="/dashboard/profile">My Profile</NavLink>
                  </li>

                  <li>
                    <NavLink to="/notifications">
                      Notifications ({unreadCount})
                    </NavLink>
                  </li>

                  <li>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex items-center gap-3 text-red-400"
                    >
                      <FaArrowRightFromBracket />
                      Sign out
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
