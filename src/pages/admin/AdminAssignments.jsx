
import { useEffect, useState } from "react";
import {
  FaClipboardList,
  FaBookOpen,
  FaPlus,
  FaTrash,
  FaEdit,
  FaSave,
  FaCheckCircle,
  FaExclamationCircle,
  FaCalendarAlt,
  FaArrowLeft,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const initialForm = {
  course: "",
  weekNumber: "1",
  title: "",
  description: "",
  instructions: "",
  dueDate: "",
  points: "100",
  isPublished: false,
};

export default function AdminAssignments() {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [form, setForm] = useState(initialForm);

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const token = () => localStorage.getItem("token");

  const headers = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token()}`,
  });

  // Fetch courses and existing assignments
  const fetchData = async () => {
    try {
      setFetching(true);

      const [courseResponse, assignmentResponse] =
        await Promise.all([
          fetch(`${API_URL}/courses`),
          fetch(`${API_URL}/assignments`),
        ]);

      if (!courseResponse.ok || !assignmentResponse.ok) {
        throw new Error("Unable to load admin data.");
      }

      const courseData = await courseResponse.json();
      const assignmentData = await assignmentResponse.json();

      setCourses(courseData.courses || []);
      setAssignments(assignmentData.assignments || []);
    } catch (error) {
      setFeedback({
        type: "error",
        message: error.message,
      });
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  // Create or update assignment
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);

    if (
      !form.course ||
      !form.title.trim() ||
      !form.description.trim()
    ) {
      setFeedback({
        type: "error",
        message: "Please complete all required fields.",
      });
      return;
    }

    const points = Number(form.points);
    const weekNumber = Number(form.weekNumber);

    if (
      !Number.isInteger(points) ||
      points < 0 ||
      !Number.isInteger(weekNumber) ||
      weekNumber < 1 ||
      weekNumber > 8
    ) {
      setFeedback({
        type: "error",
        message: "Please enter a valid week and points value.",
      });
      return;
    }

    if (!token()) {
      setFeedback({
        type: "error",
        message: "Please log in again.",
      });
      return;
    }

    const payload = {
      weekNumber,
      title: form.title.trim(),
      description: form.description.trim(),
      instructions: form.instructions
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
      dueDate: form.dueDate
        ? new Date(`${form.dueDate}T23:59:00`).toISOString()
        : null,
      points,
      isPublished: form.isPublished,
    };

    // Course is required on creation.
    if (!editingId) {
      payload.course = form.course;
    }

    try {
      setLoading(true);

      const url = editingId
        ? `${API_URL}/assignments/${editingId}`
        : `${API_URL}/assignments`;

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: headers(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to save assignment."
        );
      }

      setFeedback({
        type: "success",
        message:
          data.message ||
          (editingId
            ? "Assignment updated successfully!"
            : "Assignment created successfully!"),
      });

      resetForm();
      await fetchData();
    } catch (error) {
      setFeedback({
        type: "error",
        message: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // Load assignment into form for editing
  const handleEdit = (assignment) => {
    const date = assignment.dueDate
      ? new Date(assignment.dueDate).toISOString().split("T")[0]
      : "";

    setEditingId(assignment._id);

    setForm({
      course:
        typeof assignment.course === "object"
          ? assignment.course?._id || ""
          : assignment.course || "",
      weekNumber: String(assignment.weekNumber),
      title: assignment.title || "",
      description: assignment.description || "",
      instructions: (assignment.instructions || []).join("\n"),
      dueDate: date,
      points: String(assignment.points ?? 100),
      isPublished: assignment.isPublished ?? false,
    });

    setFeedback(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete assignment
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this assignment? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      const response = await fetch(
        `${API_URL}/assignments/${id}`,
        {
          method: "DELETE",
          headers: headers(),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to delete assignment."
        );
      }

      setFeedback({
        type: "success",
        message: data.message || "Assignment deleted successfully.",
      });

      if (editingId === id) resetForm();

      await fetchData();
    } catch (error) {
      setFeedback({
        type: "error",
        message: error.message,
      });
    } finally {
      setDeletingId(null);
    }
  };

  const selectedCourse = courses.find(
    (course) => course._id === form.course
  );

  const getCourseName = (assignment) => {
    if (typeof assignment.course === "object") {
      return assignment.course?.title || "Unknown course";
    }

    return (
      courses.find((course) => course._id === assignment.course)
        ?.title || "Unknown course"
    );
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
              Assignments
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Create, manage and publish weekly student assignments.
            </p>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#173b5f] text-xl text-white shadow-lg">
            <FaClipboardList />
          </div>
        </div>

        {/* Feedback */}
        {feedback && (
          <div
            className={`mb-6 flex items-start gap-3 rounded-xl p-4 text-sm ${
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

            <button
              type="button"
              onClick={() => setFeedback(null)}
              className="ml-auto font-bold"
            >
              ×
            </button>
          </div>
        )}

        <div className="grid items-start gap-7 lg:grid-cols-[1.4fr_0.8fr]">

          {/* Assignment Form */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">

            <div className="mb-7 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-[#173b5f]">
                  {editingId ? "Edit assignment" : "Create assignment"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Fill in the assignment details below.
                </p>
              </div>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#173b5f]"
                >
                  <FaArrowLeft />
                  Cancel
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Course and week */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Select course *
                  </label>

                  <select
                    value={form.course}
                    onChange={(e) =>
                      updateField("course", e.target.value)
                    }
                    disabled={!!editingId}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#173b5f] disabled:bg-slate-100"
                  >
                    <option value="">Choose a course</option>

                    {courses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {course.title}
                      </option>
                    ))}
                  </select>

                  {editingId && (
                    <p className="mt-1 text-xs text-slate-400">
                      Course cannot be changed while editing.
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Week number *
                  </label>

                  <select
                    value={form.weekNumber}
                    onChange={(e) =>
                      updateField("weekNumber", e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#173b5f]"
                  >
                    {Array.from({ length: 8 }, (_, index) => (
                      <option key={index + 1} value={index + 1}>
                        Week {index + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Assignment title *
                </label>

                <input
                  value={form.title}
                  onChange={(e) =>
                    updateField("title", e.target.value)
                  }
                  maxLength={150}
                  required
                  placeholder="e.g. Build Your Personal Profile Page"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#173b5f]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Assignment description *
                </label>

                <textarea
                  value={form.description}
                  onChange={(e) =>
                    updateField("description", e.target.value)
                  }
                  required
                  rows={4}
                  placeholder="Explain what students are expected to accomplish..."
                  className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#173b5f]"
                />
              </div>

              {/* Instructions */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Assignment instructions
                </label>

                <textarea
                  value={form.instructions}
                  onChange={(e) =>
                    updateField("instructions", e.target.value)
                  }
                  rows={7}
                  placeholder={`Create a valid HTML document.\nAdd a page title.\nInclude at least two paragraphs.\nAdd an image using the img element.`}
                  className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm leading-7 outline-none focus:border-[#173b5f]"
                />

                <p className="mt-2 text-xs text-slate-400">
                  Write one instruction per line. Each line becomes a separate instruction for students.
                </p>
              </div>

              {/* Deadline and points */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <FaCalendarAlt className="text-slate-400" />
                    Due date
                  </label>

                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(e) =>
                      updateField("dueDate", e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#173b5f]"
                  />

                  <p className="mt-1 text-xs text-slate-400">
                    Leave empty if there is no deadline.
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Total points
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={form.points}
                    onChange={(e) =>
                      updateField("points", e.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#173b5f]"
                  />
                </div>
              </div>

              {/* Publish toggle */}
              <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 text-[#173b5f]">
                    {form.isPublished ? <FaEye /> : <FaEyeSlash />}
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      Publish assignment
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {form.isPublished
                        ? "Students can access this assignment."
                        : "Save as a draft. Students cannot access it yet."}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={form.isPublished}
                  onClick={() =>
                    updateField("isPublished", !form.isPublished)
                  }
                  className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                    form.isPublished
                      ? "bg-[#173b5f]"
                      : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
                      form.isPublished ? "left-6" : "left-1"
                    }`}
                  />
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || fetching}
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#173b5f] px-6 py-4 font-semibold text-white shadow-lg shadow-blue-950/10 transition hover:bg-[#214d77] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {editingId ? <FaSave /> : <FaPlus />}

                {loading
                  ? "Saving assignment..."
                  : editingId
                    ? "Update assignment"
                    : "Create assignment"}
              </button>
            </form>
          </section>

          {/* Live Preview */}
          <aside className="space-y-5">

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#b58a3b]">
                Live preview
              </p>

              <h2 className="mt-2 text-xl font-bold text-[#173b5f]">
                Student assignment
              </h2>

              <div className="mt-5 rounded-2xl border border-slate-100 bg-[#f8fafc] p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-[#173b5f]">
                    Week {form.weekNumber}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                      form.isPublished
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {form.isPublished ? "Published" : "Draft"}
                  </span>
                </div>

                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-[#b58a3b]">
                  {selectedCourse?.title || "Course name"}
                </p>

                <h3 className="mt-2 break-words text-lg font-bold text-slate-800">
                  {form.title || "Your assignment title"}
                </h3>

                <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">
                  {form.description ||
                    "Your assignment description will appear here."}
                </p>

                <div className="mt-5 flex flex-wrap gap-3 border-t border-slate-200 pt-4 text-xs text-slate-500">
                  <span>
                    <FaClipboardList className="mr-1 inline" />
                    {form.points || 0} points
                  </span>

                  <span>
                    <FaCalendarAlt className="mr-1 inline" />
                    {form.dueDate || "No deadline"}
                  </span>
                </div>

                {form.instructions.trim() && (
                  <div className="mt-5 border-t border-slate-200 pt-4">
                    <p className="mb-3 text-sm font-bold text-slate-800">
                      Instructions
                    </p>

                    <ol className="space-y-2 pl-5 text-sm leading-6 text-slate-600 list-decimal">
                      {form.instructions
                        .split("\n")
                        .filter((item) => item.trim())
                        .map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                    </ol>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-3xl bg-[#173b5f] p-6 text-white">
              <FaBookOpen className="mb-4 text-2xl text-[#d8b36a]" />

              <h3 className="text-lg font-bold">
                Build better learning experiences.
              </h3>

              <p className="mt-2 text-sm leading-6 text-blue-100">
                Give students clear instructions, practical challenges
                and meaningful deadlines. Every assignment should help
                them build something real.
              </p>
            </div>
          </aside>
        </div>

        {/* Existing Assignments */}
        <section className="mt-10">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-[#173b5f]">
                Manage assignments
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                View and manage your existing assignments.
              </p>
            </div>

            <span className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-[#173b5f] shadow-sm">
              {assignments.length} total
            </span>
          </div>

          {fetching ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
              Loading assignments...
            </div>
          ) : assignments.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
              <FaClipboardList className="mx-auto mb-4 text-3xl text-slate-300" />

              <h3 className="font-bold text-slate-700">
                No assignments yet
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Your assignments will appear here once you create them.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {assignments.map((assignment) => (
                <article
                  key={assignment._id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-bold text-[#173b5f]">
                          Week {assignment.weekNumber}
                        </span>

                        <span
                          className={`rounded-md px-2 py-1 text-xs font-semibold ${
                            assignment.isPublished
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {assignment.isPublished
                            ? "Published"
                            : "Draft"}
                        </span>
                      </div>

                      <h3 className="break-words font-bold text-slate-800">
                        {assignment.title}
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        {getCourseName(assignment)} ·{" "}
                        {assignment.points} points
                      </p>

                      <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                        {assignment.description}
                      </p>
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(assignment)}
                        className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-[#173b5f] transition hover:bg-blue-50"
                      >
                        <FaEdit />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(assignment._id)}
                        disabled={deletingId === assignment._id}
                        className="flex items-center gap-2 rounded-lg border border-red-100 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                      >
                        <FaTrash />
                        {deletingId === assignment._id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
