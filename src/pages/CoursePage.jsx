import { useState, useEffect } from "react";
import {
  FaBookOpen,
  FaCheck,
  FaClock,
  FaLaptopCode,
  FaCode,
  FaRegCircle,
  FaExternalLinkAlt,
} from "react-icons/fa";

const API_URL = "http://localhost:8000/api";

const Courses = () => {
  const [weeks, setWeeks] = useState([]);
  const [completedWeeks, setCompletedWeeks] = useState([]);
  const [submissions, setSubmissions] = useState({});
  const [activeAssignment, setActiveAssignment] = useState(null);

  const [submissionText, setSubmissionText] = useState("");
  const [projectLink, setProjectLink] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch course curriculum and assignments
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError("");

        const courseResponse = await fetch(`${API_URL}/courses`);

        if (!courseResponse.ok) {
          throw new Error("Unable to load courses.");
        }

        const courseData = await courseResponse.json();

        const course = courseData.courses?.find(
          (item) => item.title === "Web Development",
        );

        if (!course) {
          throw new Error("Web Development course was not found.");
        }

        const assignmentResponse = await fetch(
          `${API_URL}/assignments/course/${course._id}`,
        );

        if (!assignmentResponse.ok) {
          throw new Error("Unable to load assignments.");
        }

        const assignmentData = await assignmentResponse.json();

        const courseWeeks = (course.weeks || [])
          .map((week) => {
            const assignment = assignmentData.assignments?.find(
              (item) => item.weekNumber === week.weekNumber,
            );

            return {
              ...week,
              week: week.weekNumber,
              assignment: assignment?.description || "Assignment coming soon.",
              assignmentId: assignment?._id || null,
              assignmentTitle:
                assignment?.title || `Week ${week.weekNumber} Assignment`,
            };
          })
          .sort((a, b) => a.week - b.week);

        setWeeks(courseWeeks);

        // Fetch logged-in student's submissions
        const token = localStorage.getItem("token");

        if (token) {
          const submissionResponse = await fetch(
            `${API_URL}/submissions/my-submissions`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          if (submissionResponse.ok) {
            const submissionData = await submissionResponse.json();
            const savedSubmissions = {};

            submissionData.submissions?.forEach((submission) => {
              const weekNumber = submission.assignment?.weekNumber;

              if (weekNumber) {
                savedSubmissions[weekNumber] = {
                  id: submission._id,
                  text: submission.submissionText || "",
                  projectLink: submission.projectLink || "",
                  fileName: submission.file?.fileName || "",
                  status: submission.status,
                  submittedAt: submission.submittedAt,
                };
              }
            });

            setSubmissions(savedSubmissions);
          }
        }
      } catch (err) {
        console.error("Course loading error:", err);
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, []);

  // Open assignment modal
  const openAssignment = (item) => {
    setActiveAssignment(item);
    setSubmissionText(submissions[item.week]?.text || "");
    setProjectLink(submissions[item.week]?.projectLink || "");
    setSelectedFile(null);
  };

  // Close assignment modal
  const closeAssignment = () => {
    setActiveAssignment(null);
    setSubmissionText("");
    setProjectLink("");
    setSelectedFile(null);
  };

  // Submit assignment to backend
  const handleAssignmentSubmit = async (e) => {
    e.preventDefault();

    if (!activeAssignment?.assignmentId) {
      alert("This assignment is not available yet.");
      return;
    }

    if (!submissionText.trim() && !projectLink.trim() && !selectedFile) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please log in before submitting an assignment.");
      return;
    }

    // Actual file upload is not connected yet.
    if (selectedFile) {
      alert(
        "File uploads are not connected yet. Please submit your work using the text field or a project link for now.",
      );

      if (!submissionText.trim() && !projectLink.trim()) {
        return;
      }
    }

    try {
      setSubmitting(true);

      const response = await fetch(
        `${API_URL}/submissions/${activeAssignment.assignmentId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            submissionText,
            projectLink,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Submission failed.");
      }

      setSubmissions((previous) => ({
        ...previous,
        [activeAssignment.week]: {
          id: data.submission._id,
          text: submissionText,
          projectLink,
          status: data.submission.status,
          submittedAt: data.submission.submittedAt,
        },
      }));

      closeAssignment();
    } catch (err) {
      console.error("Submission error:", err);
      alert(err.message || "Could not submit assignment.");
    } finally {
      setSubmitting(false);
    }
  };

  // Mark week complete only after assignment submission
  const toggleComplete = (week) => {
    if (!submissions[week]) return;

    setCompletedWeeks((previous) =>
      previous.includes(week)
        ? previous.filter((item) => item !== week)
        : [...previous, week],
    );
  };

  const progress = weeks.length
    ? Math.round((completedWeeks.length / weeks.length) * 100)
    : 0;

  return (
    <main className="min-h-screen bg-white px-4 py-10 text-gray-900 sm:px-6 lg:py-16">
      <div className="mx-auto max-w-4xl">
        {/* Loading */}
        {loading && (
          <div className="py-20 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
            <p className="mt-4 text-sm text-gray-500">
              Loading your curriculum...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            {error}
            <button
              onClick={() => window.location.reload()}
              className="ml-2 font-semibold underline"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Course heading */}
            <div className="mb-10">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-600">
                Your learning roadmap
              </p>

              <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Web Development
              </h1>

              <p className="mt-4 max-w-2xl leading-7 text-gray-600">
                Learn HTML, CSS and JavaScript step by step. Complete your
                weekly assignments and track your progress as you develop your
                coding skills.
              </p>

              <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-2">
                  <FaBookOpen className="text-violet-600" />
                  {weeks.length} learning weeks
                </span>

                <span className="flex items-center gap-2">
                  <FaClock className="text-violet-600" />
                  Beginner level
                </span>

                <span className="flex items-center gap-2">
                  <FaLaptopCode className="text-violet-600" />
                  Practical projects
                </span>
              </div>
            </div>

            {/* Course progress */}
            <section className="mb-10 rounded-2xl border border-gray-200 bg-gray-50 p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500">Your course progress</p>

                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    {completedWeeks.length}
                    <span className="text-base font-medium text-gray-500">
                      {" "}
                      / {weeks.length} weeks completed
                    </span>
                  </p>
                </div>

                <span className="text-2xl font-bold text-violet-600">
                  {progress}%
                </span>
              </div>

              <div
                className="mt-5 h-2 overflow-hidden rounded-full bg-gray-200"
                role="progressbar"
                aria-label="Course progress"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full rounded-full bg-violet-600 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </section>

            {/* Curriculum */}
            <section>
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Weekly course outline
                </h2>

                <span className="text-sm text-gray-500">
                  {weeks.length} weeks
                </span>
              </div>

              <div className="space-y-5">
                {weeks.map((item) => {
                  const isCompleted = completedWeeks.includes(item.week);
                  const hasSubmission = !!submissions[item.week];

                  return (
                    <article
                      key={item.week}
                      className={`rounded-2xl border p-5 transition-colors sm:p-6 ${
                        isCompleted
                          ? "border-violet-300 bg-violet-50"
                          : "border-gray-200 bg-white hover:border-violet-200 hover:shadow-sm"
                      }`}
                    >
                      {/* Week heading */}
                      <div className="flex items-start gap-4">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                            isCompleted
                              ? "bg-violet-600 text-white"
                              : "bg-violet-50 text-violet-700"
                          }`}
                        >
                          {isCompleted ? (
                            <FaCheck />
                          ) : (
                            String(item.week).padStart(2, "0")
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-xs font-semibold uppercase tracking-widest text-violet-600">
                              Week {item.week}
                            </p>

                            <span className="rounded-md bg-gray-100 px-2 py-1 text-[10px] font-bold uppercase text-gray-600">
                              {item.subject}
                            </span>
                          </div>

                          <h3 className="mt-1 text-lg font-semibold text-gray-900">
                            {item.title}
                          </h3>

                          <p className="mt-2 text-sm leading-6 text-gray-600">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      {/* Topics */}
                      <div className="mt-6 border-t border-gray-100 pt-5">
                        <p className="text-sm font-semibold text-gray-900">
                          Topics covered
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {(item.topics || []).map((topic) => (
                            <span
                              key={topic}
                              className="rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-600"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Learning materials */}

                      {/* Learning materials */}
                      <div className="mt-6 border-t border-gray-100 pt-5">
                        <p className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                          <FaBookOpen className="text-violet-600" />
                          Learning materials
                        </p>

                        <p className="mt-2 text-sm leading-6 text-gray-600">
                          {item.material}
                        </p>

                        {(item.resources || []).map((resource) => (
                          <div
                            key={resource.title}
                            className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 p-3"
                          >
                            <div>
                              <p className="text-sm font-medium text-gray-800">
                                {resource.title}
                              </p>

                              <p className="mt-1 text-xs text-gray-400">
                                {resource.provider}
                              </p>
                            </div>

                            {resource.url ? (
                              <a
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex shrink-0 items-center gap-2 text-xs font-semibold text-violet-600 hover:text-violet-800"
                              >
                                Open lesson
                                <FaExternalLinkAlt />
                              </a>
                            ) : (
                              <span className="text-xs text-red-500">
                                URL missing
                              </span>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Assignment */}
                      <button
                        type="button"
                        onClick={() => openAssignment(item)}
                        className="mt-5 w-full rounded-xl border border-violet-100 bg-violet-50 p-4 text-left transition hover:border-violet-300 hover:bg-violet-100"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="flex items-center gap-2 text-sm font-semibold text-violet-800">
                            <FaCode />
                            {item.assignmentTitle}
                          </p>

                          {hasSubmission ? (
                            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                              Submitted
                            </span>
                          ) : (
                            <span className="text-xs font-semibold text-violet-700">
                              Submit assignment →
                            </span>
                          )}
                        </div>

                        <p className="mt-2 text-sm leading-6 text-gray-700">
                          {item.assignment}
                        </p>

                        <p className="mt-3 text-xs font-medium text-violet-700">
                          {hasSubmission
                            ? "View or update your submission"
                            : "Click to read instructions and submit your work"}
                        </p>
                      </button>

                      {/* Completion */}
                      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                        <span
                          className={`text-sm font-medium ${
                            isCompleted
                              ? "text-emerald-600"
                              : hasSubmission
                                ? "text-blue-600"
                                : "text-gray-500"
                          }`}
                        >
                          {isCompleted
                            ? "Week completed"
                            : hasSubmission
                              ? "Assignment submitted"
                              : "Assignment submission required"}
                        </span>

                        <button
                          type="button"
                          disabled={!hasSubmission && !isCompleted}
                          onClick={() => toggleComplete(item.week)}
                          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
                            isCompleted
                              ? "border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                              : hasSubmission
                                ? "bg-violet-600 text-white hover:bg-violet-700"
                                : "cursor-not-allowed bg-gray-100 text-gray-400"
                          }`}
                        >
                          {isCompleted ? (
                            <>
                              <FaRegCircle />
                              Mark incomplete
                            </>
                          ) : hasSubmission ? (
                            <>
                              <FaCheck />
                              Mark as completed
                            </>
                          ) : (
                            <>
                              <FaClock />
                              Submit assignment first
                            </>
                          )}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          </>
        )}
      </div>

      {/* Assignment Submission Modal */}
      {activeAssignment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#101329]/60 px-4 py-6 backdrop-blur-sm"
          onClick={closeAssignment}
        >
          <div
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-violet-600">
                  Week {activeAssignment.week} Assignment
                </p>

                <h2 className="mt-2 text-2xl font-bold text-gray-900">
                  {activeAssignment.assignmentTitle}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeAssignment}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close assignment"
              >
                ✕
              </button>
            </div>

            {/* Instructions */}
            <div className="mt-6 rounded-xl border border-violet-100 bg-violet-50 p-5">
              <h3 className="text-sm font-bold text-violet-900">
                Assignment instructions
              </h3>

              <p className="mt-3 text-sm leading-7 text-gray-700">
                {activeAssignment.assignment}
              </p>
            </div>

            {/* Submission Form */}
            <form onSubmit={handleAssignmentSubmit} className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-800">
                  Your submission
                </label>

                <textarea
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  rows={5}
                  placeholder="Describe your work or explain what you have completed..."
                  className="w-full rounded-xl border border-gray-200 p-4 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                />
              </div>

              {/* Project Link */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-800">
                  Project URL (optional)
                </label>

                <input
                  type="url"
                  value={projectLink}
                  onChange={(e) => setProjectLink(e.target.value)}
                  placeholder="https://github.com/yourusername/project"
                  className="w-full rounded-xl border border-gray-200 p-4 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-800">
                  Attach your project
                </label>

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 p-6 text-center transition hover:border-violet-400 hover:bg-violet-50">
                  <FaLaptopCode className="text-3xl text-violet-500" />

                  <p className="mt-3 text-sm font-semibold text-gray-700">
                    Click to upload your work
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    HTML, CSS, JS, ZIP, PDF or images
                  </p>

                  <input
                    type="file"
                    accept=".html,.css,.js,.zip,.pdf,.png,.jpg,.jpeg"
                    className="hidden"
                    onChange={(e) =>
                      setSelectedFile(e.target.files?.[0] || null)
                    }
                  />
                </label>

                {selectedFile && (
                  <div className="mt-3 flex items-center justify-between rounded-lg bg-gray-50 p-3">
                    <span className="truncate text-sm text-gray-700">
                      {selectedFile.name}
                    </span>

                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      className="ml-3 text-sm font-semibold text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Previous Submission */}
              {submissions[activeAssignment.week] && (
                <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-3">
                  <p className="text-sm font-semibold text-emerald-700">
                    Previous submission recorded
                  </p>

                  <p className="mt-1 text-xs text-emerald-600">
                    You can update your submission.
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeAssignment}
                  className="rounded-lg border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    submitting ||
                    (!submissionText.trim() &&
                      !projectLink.trim() &&
                      !selectedFile)
                  }
                  className="rounded-lg bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  {submitting ? "Submitting..." : "Submit assignment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Courses;
