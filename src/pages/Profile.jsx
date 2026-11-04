
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  FaRegCircleUser,
  FaRegEnvelope,
  FaGraduationCap,
  FaCalendarDays,
  FaPen,
  FaShieldHalved,
  FaArrowRightFromBracket,
  FaCamera,
  FaUpload,
  FaXmark,
} from 'react-icons/fa6';

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const [student, setStudent] = useState({
    firstName: '',
    lastName: '',
    email: '',
    learningGoal: '',
    bio: '',
    profileImage: '',
    role: 'student',
    createdAt: '',
  });

  const [originalStudent, setOriginalStudent] = useState(null);

  // Fetch registered student information
  const fetchStudent = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${API_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login', { replace: true });
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || 'Unable to load your profile.');
      }

      const user = data.user || data;

      const profileData = {
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        learningGoal: user.learningGoal || 'Become a web developer',
        bio: user.bio || '',
        profileImage: user.profileImage || '',
        role: user.role || 'student',
        createdAt: user.createdAt || '',
      };

      setStudent(profileData);
      setOriginalStudent(profileData);
    } catch (err) {
      setError(err.message || 'Something went wrong while loading your profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudent();
  }, []);

  // Clean up temporary preview URLs
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const fullName = [student.firstName, student.lastName]
    .filter(Boolean)
    .join(' ');

  const updateStudent = (field, value) => {
    setStudent((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // Select a profile picture
  const handleImageSelect = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError('');
    setSuccess('');

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ];

    if (!allowedTypes.includes(file.type)) {
      setError('Please select a JPG, PNG or WebP image.');
      event.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Your image must be smaller than 5 MB.');
      event.target.value = '';
      return;
    }

    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  // Upload selected image to Cloudinary through the backend
  const handleImageUpload = async () => {
    if (!selectedImage) {
      setError('Please select an image first.');
      return;
    }

    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    try {
      setUploading(true);
      setError('');
      setSuccess('');

      const formData = new FormData();
      formData.append('profileImage', selectedImage);

      const response = await fetch(
        `${API_URL}/users/me/profile-image`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login', { replace: true });
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message || 'Profile picture upload failed.'
        );
      }

      const updatedUser = data.user || data;
      const imageUrl = updatedUser.profileImage;

      if (!imageUrl) {
        throw new Error('The server did not return the uploaded image URL.');
      }

      setStudent((previous) => ({
        ...previous,
        profileImage: imageUrl,
      }));

      setOriginalStudent((previous) => ({
        ...previous,
        profileImage: imageUrl,
      }));

      setSelectedImage(null);
      setPreviewUrl('');

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      setSuccess('Your profile picture has been updated successfully.');

      // Refresh the Navbar so it displays the new picture
      window.dispatchEvent(new Event('authChanged'));
    } catch (err) {
      setError(err.message || 'Something went wrong while uploading your picture.');
    } finally {
      setUploading(false);
    }
  };

  // Cancel selected picture
  const handleCancelImage = () => {
    setSelectedImage(null);
    setPreviewUrl('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    setError('');
  };

  // Cancel profile editing
  const handleCancel = () => {
    setStudent(originalStudent);
    setEditing(false);
    setError('');
    setSuccess('');
  };

  // Save profile information
  const handleSave = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    if (!student.firstName.trim() || !student.lastName.trim()) {
      setError('Please enter both your first and last name.');
      return;
    }

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const response = await fetch(`${API_URL}/users/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email,
          learningGoal: student.learningGoal,
          bio: student.bio,
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login', { replace: true });
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || 'Could not update your profile.');
      }

      const updatedUser = data.user || data;

      const updatedProfile = {
        firstName: updatedUser.firstName || student.firstName,
        lastName: updatedUser.lastName || student.lastName,
        email: updatedUser.email || student.email,
        learningGoal: updatedUser.learningGoal ?? student.learningGoal,
        bio: updatedUser.bio ?? student.bio,
        profileImage: updatedUser.profileImage || student.profileImage,
        role: updatedUser.role || student.role,
        createdAt: updatedUser.createdAt || student.createdAt,
      };

      setStudent(updatedProfile);
      setOriginalStudent(updatedProfile);
      setEditing(false);
      setSuccess('Your profile has been updated successfully.');

      window.dispatchEvent(new Event('authChanged'));
    } catch (err) {
      setError(err.message || 'Something went wrong while saving.');
    } finally {
      setSaving(false);
    }
  };

  const registrationDate = student.createdAt
    ? new Date(student.createdAt).toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'Unavailable';

  const displayedImage = previewUrl || student.profileImage;

  // Loading screen
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-violet-700" />
          <p className="mt-4 text-sm text-slate-500">
            Loading your profile...
          </p>
        </div>
      </main>
    );
  }

  // Error screen
  if (error && !student.email) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-5">
        <div className="max-w-md text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchStudent}
            className="mt-5 rounded-md bg-violet-700 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-800"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-5 py-10 text-slate-900 sm:px-8 lg:py-14">
      <div className="mx-auto max-w-5xl">

        {/* PAGE HEADING */}
        <div className="mb-10 border-b border-slate-200 pb-7">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-700">
            Student account
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            My Profile
          </h1>

          <p className="mt-3 text-slate-500">
            Manage your personal information and learning goals.
          </p>
        </div>

        {/* NOTIFICATIONS */}
        {error && (
          <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </div>
        )}

        {/* PROFILE IDENTITY */}
        <section className="flex flex-col gap-6 border-b border-slate-200 pb-9 sm:flex-row sm:items-center">

          {/* PROFILE PICTURE */}
          <div className="flex shrink-0 flex-col items-center gap-3">
            <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-50 text-slate-400">
              {displayedImage ? (
                <img
                  src={displayedImage}
                  alt={fullName || 'Student'}
                  className="h-full w-full object-cover"
                />
              ) : (
                <FaRegCircleUser className="text-7xl" />
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                title="Choose profile picture"
                className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-violet-700 text-white transition hover:bg-violet-800 disabled:opacity-50"
              >
                <FaCamera className="text-sm" />
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageSelect}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="text-xs font-semibold text-violet-700 transition hover:text-violet-900 disabled:opacity-50"
            >
              Change photo
            </button>
          </div>

          {/* STUDENT DETAILS */}
          <div className="flex-1">
            <p className="text-sm text-slate-500">
              YouthForge learner
            </p>

            <h2 className="mt-1 text-2xl font-semibold">
              {fullName || 'Student'}
            </h2>

            <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
              <FaRegEnvelope />
              {student.email}
            </p>

            <div className="mt-4 inline-flex items-center gap-2 border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium capitalize text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {student.role} account
            </div>

            {/* IMAGE PREVIEW ACTIONS */}
            {selectedImage && (
              <div className="mt-4 rounded-lg border border-violet-200 bg-violet-50 p-4">
                <p className="text-sm font-semibold text-slate-800">
                  New profile picture selected
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {selectedImage.name} · {(selectedImage.size / (1024 * 1024)).toFixed(2)} MB
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleImageUpload}
                    disabled={uploading}
                    className="inline-flex items-center gap-2 rounded-md bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <FaUpload />
                    {uploading ? 'Uploading...' : 'Upload picture'}
                  </button>

                  <button
                    type="button"
                    onClick={handleCancelImage}
                    disabled={uploading}
                    className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
                  >
                    <FaXmark />
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <p className="mt-3 text-xs text-slate-400">
              JPG, PNG or WebP. Maximum file size: 5 MB.
            </p>
          </div>

          {/* EDIT PROFILE BUTTON */}
          <button
            type="button"
            onClick={() => {
              if (editing) {
                handleCancel();
              } else {
                setEditing(true);
                setSuccess('');
                setError('');
              }
            }}
            className="inline-flex items-center justify-center gap-2 self-start rounded-md border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 sm:self-center"
          >
            <FaPen className="text-xs" />
            {editing ? 'Cancel editing' : 'Edit profile'}
          </button>
        </section>

        {/* PERSONAL INFORMATION */}
        <section className="border-b border-slate-200 py-9">
          <div className="mb-7">
            <h2 className="text-lg font-semibold">
              Personal information
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              The details associated with your registered account.
            </p>
          </div>

          <div className="space-y-6">

            {/* FIRST NAME */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                First name
              </label>

              <input
                type="text"
                value={student.firstName}
                readOnly={!editing}
                onChange={(e) => updateStudent('firstName', e.target.value)}
                className={`w-full rounded-md border px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 ${
                  editing
                    ? 'border-slate-300 bg-white'
                    : 'border-slate-200 bg-slate-50 text-slate-600'
                }`}
              />
            </div>

            {/* LAST NAME */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Last name
              </label>

              <input
                type="text"
                value={student.lastName}
                readOnly={!editing}
                onChange={(e) => updateStudent('lastName', e.target.value)}
                className={`w-full rounded-md border px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 ${
                  editing
                    ? 'border-slate-300 bg-white'
                    : 'border-slate-200 bg-slate-50 text-slate-600'
                }`}
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email address
              </label>

              <input
                type="email"
                value={student.email}
                readOnly={!editing}
                onChange={(e) => updateStudent('email', e.target.value)}
                className={`w-full rounded-md border px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 ${
                  editing
                    ? 'border-slate-300 bg-white'
                    : 'border-slate-200 bg-slate-50 text-slate-600'
                }`}
              />
            </div>

            {/* LEARNING GOAL */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Learning goal
              </label>

              <input
                type="text"
                value={student.learningGoal}
                readOnly={!editing}
                onChange={(e) => updateStudent('learningGoal', e.target.value)}
                className={`w-full rounded-md border px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 ${
                  editing
                    ? 'border-slate-300 bg-white'
                    : 'border-slate-200 bg-slate-50 text-slate-600'
                }`}
              />
            </div>

            {/* BIO */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                About me
              </label>

              <textarea
                rows={4}
                value={student.bio}
                readOnly={!editing}
                onChange={(e) => updateStudent('bio', e.target.value)}
                className={`w-full resize-y rounded-md border px-4 py-3 text-sm leading-6 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 ${
                  editing
                    ? 'border-slate-300 bg-white'
                    : 'border-slate-200 bg-slate-50 text-slate-600'
                }`}
              />
            </div>
          </div>

          {editing && (
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="rounded-md bg-violet-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          )}
        </section>

        {/* LEARNING SUMMARY */}
        <section className="border-b border-slate-200 py-9">
          <h2 className="text-lg font-semibold">
            Learning overview
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            A summary of your learning journey will appear here as you
            progress through your course.
          </p>

          <div className="mt-6 flex items-start gap-4 rounded-lg border border-slate-200 p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-violet-50 text-violet-700">
              <FaGraduationCap className="text-xl" />
            </div>

            <div>
              <h3 className="font-semibold">Web Development</h3>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                HTML, CSS, JavaScript, practical assignments, and a final
                project.
              </p>

              <p className="mt-3 text-sm font-medium text-violet-700">
                Beginner programme
              </p>
            </div>
          </div>
        </section>

        {/* ACCOUNT INFORMATION */}
        <section className="py-9">
          <h2 className="text-lg font-semibold">
            Account information
          </h2>

          <div className="mt-5 divide-y divide-slate-200 border-y border-slate-200">

            <div className="flex items-center gap-4 py-5">
              <FaShieldHalved className="text-lg text-slate-400" />

              <div className="flex-1">
                <h3 className="text-sm font-semibold">
                  Account role
                </h3>

                <p className="mt-1 text-sm capitalize text-slate-500">
                  {student.role}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 py-5">
              <FaCalendarDays className="text-lg text-slate-400" />

              <div className="flex-1">
                <h3 className="text-sm font-semibold">
                  Member since
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {registrationDate}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 py-5">
              <FaArrowRightFromBracket className="text-lg text-slate-400" />

              <div className="flex-1">
                <h3 className="text-sm font-semibold">
                  Account security
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Password and security settings.
                </p>
              </div>

              <span className="text-xs text-slate-400">
                Coming soon
              </span>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
};

export default Profile;
