
import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';

import {
  FaArrowRight,
  FaCode,
  FaHeart,
  FaRegHeart,
  FaRegComment,
  FaPaperPlane,
  FaImage,
  FaLightbulb,
  FaRocket,
  FaRegCircleUser,
  FaMicrochip,
  FaLaptopCode,
  FaShieldHalved,
  FaBriefcase,
  FaGraduationCap,
  FaTrophy,
  FaCalendarDays,
  FaBookmark,
  FaRegBookmark,
  FaGlobe,
  FaNewspaper,
  FaFire,
  FaClock,
  FaArrowUpRightFromSquare, 
  FaXmark
} from 'react-icons/fa6';

import hero1 from '../assets/youth4.jpg';
import hero2 from '../assets/youth3.jpg';
import hero3 from '../assets/youth2.jpg';
import hero4 from '../assets/youth1.jpg';
import hero5 from '../assets/youth5.jpg';
import hero6 from '../assets/youth6.jpg';
import hero7 from '../assets/youth7.jpg';

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const carouselImages = [
  hero1, hero2, hero3, hero4, hero5, hero6, hero7,
];

const getInitials = (name = 'Student') =>
  name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

// --------------------------------------------------
// THE DIGITAL PULSE - SAMPLE NEWS
// --------------------------------------------------

const newsArticles = [
  {
    id: 1,
    category: 'Artificial Intelligence',
    title: 'How AI is changing the future of education and learning',
    excerpt:
      'Explore how artificial intelligence is creating new ways to learn, research, solve problems and access knowledge.',
    image:
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1000',
    date: 'Technology insight',
    readTime: '5 min read',
    source: 'OpenAI',
    url: 'https://openai.com/news/',
    featured: true,
  },
  {
    id: 2,
    category: 'AI Tools',
    title: 'AI tools every beginner developer should explore',
    excerpt:
      'Discover tools that can help beginners understand code, debug errors and become more productive.',
    image:
      'https://images.unsplash.com/photo-1676299081847-824916de030a?w=800',
    date: 'Developer guide',
    readTime: '4 min read',
    source: 'GitHub',
    url: 'https://github.blog/',
  },
  {
    id: 3,
    category: 'Cybersecurity',
    title: 'Why cybersecurity matters in our digital world',
    excerpt:
      'Understand passwords, phishing, personal data protection and the importance of staying safe online.',
    image:
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800',
    date: 'Digital awareness',
    readTime: '6 min read',
    source: 'Cloudflare',
    url: 'https://www.cloudflare.com/learning/',
  },
  {
    id: 4,
    category: 'Technology',
    title: 'The next generation of software development',
    excerpt:
      'From cloud computing to modern web frameworks, explore the technologies shaping software engineering.',
    image:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
    date: 'Tech trends',
    readTime: '5 min read',
    source: 'GitHub',
    url: 'https://github.blog/',
  },
];

// --------------------------------------------------
// DIGITAL TECHNOLOGY TOPICS
// --------------------------------------------------

const technologyTopics = [
  {
    title: 'Artificial Intelligence',
    description: 'Explore machine learning, generative AI and intelligent systems.',
    icon: FaMicrochip,
    color: 'bg-violet-50 text-violet-700',
    link: 'https://www.ibm.com/think/topics/artificial-intelligence',
  },
  {
    title: 'Web Development',
    description: 'Learn how websites and modern web applications are built.',
    icon: FaLaptopCode,
    color: 'bg-blue-50 text-blue-700',
    link: 'https://developer.mozilla.org/',
  },
  {
    title: 'Cybersecurity',
    description: 'Understand digital security, privacy and online protection.',
    icon: FaShieldHalved,
    color: 'bg-emerald-50 text-emerald-700',
    link: 'https://www.cloudflare.com/learning/',
  },
  {
    title: 'Software Engineering',
    description: 'Discover programming, software architecture and development.',
    icon: FaCode,
    color: 'bg-amber-50 text-amber-700',
    link: 'https://github.com/explore',
  },
  {
    title: 'Digital Entrepreneurship',
    description: 'Explore technology businesses, startups and innovation.',
    icon: FaRocket,
    color: 'bg-rose-50 text-rose-700',
    link: 'https://www.startupschool.org/',
  },
  {
    title: 'Emerging Technologies',
    description: 'Discover robotics, cloud computing and future technologies.',
    icon: FaGlobe,
    color: 'bg-cyan-50 text-cyan-700',
    link: 'https://www.technologyreview.com/',
  },
];

// --------------------------------------------------
// OPPORTUNITIES
// These are discovery resources, not verified vacancies.
// --------------------------------------------------

const opportunities = [
  {
    id: 1,
    type: 'Learning',
    title: 'GitHub Student Developer Resources',
    description:
      'Explore developer tools, learning resources and student benefits.',
    icon: FaGraduationCap,
    color: 'bg-violet-50 text-violet-700',
    label: 'Student resources',
    url: 'https://education.github.com/',
  },
  {
    id: 2,
    type: 'Competitions',
    title: 'Major League Hacking',
    description:
      'Discover hackathons, coding challenges and opportunities to collaborate.',
    icon: FaTrophy,
    color: 'bg-amber-50 text-amber-700',
    label: 'Hackathons',
    url: 'https://mlh.io/',
  },
  {
    id: 3,
    type: 'Careers',
    title: 'Google Careers',
    description:
      'Explore technology career paths, internships and job opportunities.',
    icon: FaBriefcase,
    color: 'bg-blue-50 text-blue-700',
    label: 'Career discovery',
    url: 'https://www.google.com/about/careers/',
  },
  {
    id: 4,
    type: 'Events',
    title: 'Microsoft Events',
    description:
      'Discover developer events, technology workshops and conferences.',
    icon: FaCalendarDays,
    color: 'bg-emerald-50 text-emerald-700',
    label: 'Tech events',
    url: 'https://events.microsoft.com/',
  },
];

// --------------------------------------------------
// FEATURED STUDENT PROJECTS
// --------------------------------------------------

const featuredProjects = [
  {
    id: 1,
    title: 'Personal Portfolio Website',
    student: 'David Johnson',
    description:
      'A personal website built to showcase skills, projects and achievements.',
    technology: ['HTML', 'CSS'],
    image:
      'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=900',
  },
  {
    id: 2,
    title: 'Creative Landing Page',
    student: 'Sarah Williams',
    description:
      'A responsive landing page exploring modern web design and layouts.',
    technology: ['HTML', 'CSS', 'JavaScript'],
    image:
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=900',
  },
  {
    id: 3,
    title: 'Interactive Dashboard',
    student: 'Michael James',
    description:
      'A beginner project exploring interactive interfaces and JavaScript.',
    technology: ['JavaScript', 'CSS'],
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900',
  },
];

// --------------------------------------------------
// REUSABLE AVATAR
// --------------------------------------------------

const Avatar = ({ image, name, initials, size = 'h-11 w-11' }) => (
  <div
    className={`${size} flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-violet-100 font-bold text-violet-700`}
  >
    {image ? (
      <img
        src={image}
        alt={name}
        className="h-full w-full object-cover"
      />
    ) : initials ? (
      initials
    ) : (
      <FaRegCircleUser className="text-xl" />
    )}
  </div>
);

// Convert the API's MongoDB post shape into the shape used by this page.
const formatPost = (post) => {
  const author = post.author || {};
  const authorName =
    [author.firstName, author.lastName].filter(Boolean).join(' ') ||
    author.name ||
    'YouthForge Member';

  return {
    id: post._id,
    author: authorName,
    role: author.role || 'YouthForge Member',
    initials: getInitials(authorName),
    profileImage: author.profileImage || '',
    content: post.content || '',
    category: post.category || 'Community post',
    time: post.createdAt
      ? new Date(post.createdAt).toLocaleString()
      : 'Recently',
    likes: typeof post.likes === 'number' ? post.likes : (post.likes || []).length,
    liked: Boolean(post.likedByMe),
    comments: (post.comments || []).map((comment) => {
      const commentAuthor = comment.author || {};
      const commentAuthorName =
        [commentAuthor.firstName, commentAuthor.lastName]
          .filter(Boolean)
          .join(' ') ||
        commentAuthor.name ||
        'YouthForge Member';

      return {
        id: comment._id,
        author: commentAuthorName,
        text: comment.text || '',
      };
    }),
  };
};

// --------------------------------------------------
// MAIN LANDING PAGE
// --------------------------------------------------

const Landing = () => {
  const [activeImage, setActiveImage] = useState(0);

  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [postError, setPostError] = useState('');
  const [submittingPost, setSubmittingPost] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [activeComments, setActiveComments] = useState(null);
  const [commentDrafts, setCommentDrafts] = useState({});

  const [filter, setFilter] = useState('All');
  const [savedNews, setSavedNews] = useState([]);

  // Hero carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImage((current) => (current + 1) % carouselImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Fetch logged-in user
  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('token');

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
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        return;
      }

      if (!response.ok) {
        throw new Error('Unable to retrieve user information.');
      }

      const data = await response.json();
      setUser(data.user || data);
    } catch (error) {
      console.error('User retrieval error:', error);
    } finally {
      setLoadingUser(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();

    window.addEventListener('authChanged', fetchUser);
    window.addEventListener('storage', fetchUser);

    return () => {
      window.removeEventListener('authChanged', fetchUser);
      window.removeEventListener('storage', fetchUser);
    };
  }, [fetchUser]);

  // Fetch community posts from the backend.
  const fetchPosts = useCallback(async () => {
    setLoadingPosts(true);
    setPostError('');

    try {
      const response = await fetch(`${API_URL}/posts`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to load community posts.');
      }

      setPosts((data.posts || []).map(formatPost));
    } catch (error) {
      console.error('Post retrieval error:', error);
      setPostError(error.message || 'Unable to load community posts.');
    } finally {
      setLoadingPosts(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const displayName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(' ') ||
      user.name ||
      user.email?.split('@')[0] ||
      'Student'
    : 'Student';

  // Create a post and save it in MongoDB.
  const handleCreatePost = async (event) => {
    event.preventDefault();

    const content = postContent.trim();
    const token = localStorage.getItem('token');

    if (!user || !content || !token || submittingPost) return;

    setSubmittingPost(true);
    setPostError('');

    try {
      const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content,
          category: 'Community post',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to publish your post.');
      }

      if (!data.post) {
        throw new Error('The server did not return the created post.');
      }

      setPosts((previous) => [formatPost(data.post), ...previous]);
      setPostContent('');
      setFilter('All');
    } catch (error) {
      console.error('Create post error:', error);
      setPostError(error.message || 'Unable to publish your post.');
    } finally {
      setSubmittingPost(false);
    }
  };

  // Like or unlike a post through the backend.
  const handleLike = async (postId) => {
    if (!user) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to update the like.');
      }

      setPosts((previous) =>
        previous.map((post) =>
          post.id === postId
            ? {
                ...post,
                likes: data.likes,
                liked: Boolean(data.likedByMe),
              }
            : post
        )
      );
    } catch (error) {
      console.error('Like error:', error);
    }
  };

  // Toggle comments
  const toggleComments = (postId) => {
    setActiveComments((current) =>
      current === postId ? null : postId
    );
  };

  // Add a comment and save it in MongoDB.
  const handleAddComment = async (event, postId) => {
    event.preventDefault();

    if (!user) return;

    const commentText = commentDrafts[postId]?.trim();
    const token = localStorage.getItem('token');

    if (!commentText || !token) return;

    try {
      const response = await fetch(`${API_URL}/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: commentText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to add your comment.');
      }

      if (!data.comment) {
        throw new Error('The server did not return the saved comment.');
      }

      const commentAuthor = data.comment.author || {};
      const commentAuthorName =
        [commentAuthor.firstName, commentAuthor.lastName]
          .filter(Boolean)
          .join(' ') ||
        commentAuthor.name ||
        displayName;

      const newComment = {
        id: data.comment._id,
        author: commentAuthorName,
        text: data.comment.text,
      };

      setPosts((previous) =>
        previous.map((post) =>
          post.id === postId
            ? { ...post, comments: [...post.comments, newComment] }
            : post
        )
      );

      setCommentDrafts((previous) => ({
        ...previous,
        [postId]: '',
      }));
    } catch (error) {
      console.error('Add comment error:', error);
    }
  };

  // Save / unsave news
  const toggleSaveNews = (articleId) => {
    setSavedNews((previous) =>
      previous.includes(articleId)
        ? previous.filter((id) => id !== articleId)
        : [...previous, articleId]
    );
  };

  const visiblePosts =
    filter === 'All'
      ? posts
      : posts.filter((post) => post.category === filter);

  return (
    <main className="min-h-screen bg-white text-slate-900">

      {/* =================================================
          1. HERO SECTION
      ================================================= */}

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 md:grid-cols-2 md:px-10 md:py-24">

        <div>
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700">
            <FaCode />
            YouthForge · Skills for the future
          </span>

          <h1 className="max-w-xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Empowering young people to build what comes next.
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600">
            We help young people develop practical digital skills, grow their
            confidence, and turn ideas into things they can build and share
            with the world.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-3 rounded-xl bg-violet-700 px-6 py-3.5 font-semibold text-white transition hover:bg-violet-800"
            >
              Join YouthForge <FaArrowRight />
            </Link>

            <Link
              to="/about"
              className="rounded-xl border border-slate-200 px-6 py-3.5 font-semibold text-slate-700 transition hover:border-violet-300 hover:bg-violet-50"
            >
              Discover our mission
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">
            <span>✓ Free to join</span>
            <span>✓ Beginner-friendly</span>
            <span>✓ Practical learning</span>
          </div>
        </div>

        {/* HERO CAROUSEL */}
        <div className="relative">
          <div className="relative h-[360px] overflow-hidden rounded-3xl bg-slate-100 shadow-xl sm:h-[440px]">

            {carouselImages.map((image, index) => (
              <img
                key={image}
                src={image}
                alt={`YouthForge learning ${index + 1}`}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
                  activeImage === index ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />

            <div className="absolute bottom-12 left-6 right-6 text-white sm:bottom-14 sm:left-8">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-violet-200">
                The YouthForge vision
              </p>

              <h2 className="max-w-sm text-3xl font-bold leading-tight sm:text-4xl">
                Skills. Knowledge. Opportunity.
              </h2>

              <p className="mt-3 max-w-md text-sm leading-6 text-slate-200 sm:text-base">
                Learn together. Build real projects. Create new possibilities.
              </p>
            </div>

            <div className="absolute bottom-5 right-6 flex items-center gap-2">
              {carouselImages.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  aria-label={`Show slide ${index + 1}`}
                  className={`h-2.5 rounded-full transition-all ${
                    activeImage === index
                      ? 'w-8 bg-white'
                      : 'w-2.5 bg-white/60'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* =================================================
          2. STUDENT COMMUNITY
      ================================================= */}

      <section className="border-t border-slate-100 bg-slate-50 py-14">
        <div className="mx-auto grid max-w-7xl items-start gap-8 px-5 md:grid-cols-[minmax(0,1fr)_300px] md:px-10">

          {/* MAIN FEED */}
          <div className="min-w-0">

            <div className="mb-7">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-violet-700">
                YouthForge community
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight">
                What's happening?
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Share your progress, exchange ideas and learn together.
              </p>
            </div>

            {/* POST COMPOSER */}
            <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              {user ? (
                <div className="flex items-start gap-3">

                  <Avatar
                    image={user.profileImage}
                    name={displayName}
                    initials={getInitials(displayName)}
                  />

                  <div className="min-w-0 flex-1">

                    <p className="mb-3 text-sm font-semibold">
                      {displayName}
                    </p>

                    <form onSubmit={handleCreatePost}>

                      <textarea
                        value={postContent}
                        onChange={(event) =>
                          setPostContent(event.target.value)
                        }
                        placeholder="Share something with the YouthForge community..."
                        rows={3}
                        maxLength={1000}
                        className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100"
                      />

                      <div className="mt-3 flex items-center justify-between gap-3">

                        <span className="text-xs text-slate-400">
                          {postContent.length}/1000 characters
                        </span>

                        <button
                          type="submit"
                          disabled={!postContent.trim() || submittingPost}
                          className="inline-flex items-center gap-2 rounded-lg bg-violet-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {submittingPost ? 'Publishing...' : 'Post'} <FaPaperPlane />
                        </button>
                      </div>
                    </form>

                    <div className="mt-4 flex flex-wrap gap-5 border-t border-slate-100 pt-4 text-xs font-medium text-slate-500">

                      <span className="flex items-center gap-2">
                        <FaImage className="text-emerald-600" />
                        Photos coming soon
                      </span>

                      <span className="flex items-center gap-2">
                        <FaCode className="text-violet-600" />
                        Share your projects
                      </span>

                      <span className="flex items-center gap-2">
                        <FaLightbulb className="text-amber-500" />
                        Share an idea
                      </span>

                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-3 text-center">

                  <h3 className="font-semibold">
                    Join the conversation
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    Sign in to share your ideas and interact with other students.
                  </p>

                  <div className="mt-4 flex justify-center gap-3">

                    <Link
                      to="/login"
                      className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold hover:bg-slate-50"
                    >
                      Log in
                    </Link>

                    <Link
                      to="/register"
                      className="rounded-lg bg-violet-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-800"
                    >
                      Join YouthForge
                    </Link>

                  </div>
                </div>
              )}
            </div>

            {/* FEED FILTERS */}
            <div className="mb-5 flex flex-wrap items-center gap-2">

              {[
                'All',
                'Learning milestone',
                'Learning',
                'Community discussion',
                'Community post',
              ].map((category) => (

                <button
                  key={category}
                  type="button"
                  onClick={() => setFilter(category)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                    filter === category
                      ? 'bg-violet-700 text-white'
                      : 'border border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:text-violet-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* POSTS */}
            <div className="space-y-5">

              {loadingPosts ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
                  <p className="text-sm text-slate-500">Loading community posts...</p>
                </div>
              ) : postError ? (
                <div className="rounded-2xl border border-red-200 bg-white p-8 text-center">
                  <p className="font-semibold text-red-600">{postError}</p>
                  <button
                    type="button"
                    onClick={fetchPosts}
                    className="mt-3 text-sm font-semibold text-violet-700 hover:text-violet-900"
                  >
                    Try again
                  </button>
                </div>
              ) : visiblePosts.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
                  <p className="font-semibold">No posts in this category yet.</p>
                  <p className="mt-2 text-sm text-slate-500">Be the first to share something!</p>
                </div>
              ) : (
                visiblePosts.map((post) => (

                <article
                  key={post.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="p-5">

                    {/* AUTHOR */}
                    <div className="flex items-center gap-3">

                      <Avatar
                        image={post.profileImage}
                        name={post.author}
                        initials={post.initials}
                      />

                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-bold">
                          {post.author}
                        </h3>

                        <p className="mt-0.5 text-xs text-slate-500">
                          {post.role} · {post.time}
                        </p>
                      </div>

                      <span className="rounded-full bg-violet-50 px-3 py-1.5 text-[10px] font-semibold text-violet-700">
                        {post.category}
                      </span>
                    </div>

                    {/* CONTENT */}
                    <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                      {post.content}
                    </p>

                    {/* INTERACTIONS */}
                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">

                      <button
                        type="button"
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-2 text-sm font-medium transition ${
                          post.liked
                            ? 'text-red-500'
                            : 'text-slate-500 hover:text-red-500'
                        }`}
                      >
                        {post.liked ? <FaHeart /> : <FaRegHeart />}
                        {post.likes} Likes
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleComments(post.id)}
                        className="flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-violet-700"
                      >
                        <FaRegComment />
                        {post.comments.length} Comments
                      </button>
                    </div>

                    {/* COMMENT AREA */}
                    {activeComments === post.id && (

                      <div className="mt-4 border-t border-slate-100 pt-4">

                        {post.comments.length > 0 ? (
                          <div className="mb-4 space-y-3">

                            {post.comments.map((comment) => (
                              <div
                                key={comment.id}
                                className="rounded-xl bg-slate-50 p-3"
                              >
                                <p className="text-xs font-bold text-slate-800">
                                  {comment.author}
                                </p>

                                <p className="mt-1 text-sm text-slate-600">
                                  {comment.text}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="mb-4 text-xs text-slate-400">
                            No comments yet. Start the conversation.
                          </p>
                        )}

                        {user ? (
                          <form
                            onSubmit={(event) =>
                              handleAddComment(event, post.id)
                            }
                            className="flex gap-2"
                          >
                            <input
                              type="text"
                              value={commentDrafts[post.id] || ''}
                              onChange={(event) =>
                                setCommentDrafts((previous) => ({
                                  ...previous,
                                  [post.id]: event.target.value,
                                }))
                              }
                              placeholder="Write a comment..."
                              className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-400"
                            />

                            <button
                              type="submit"
                              disabled={!commentDrafts[post.id]?.trim()}
                              className="rounded-lg bg-violet-700 px-4 text-white transition hover:bg-violet-800 disabled:opacity-40"
                            >
                              <FaPaperPlane />
                            </button>
                          </form>
                        ) : (
                          <Link
                            to="/login"
                            className="text-xs font-semibold text-violet-700"
                          >
                            Log in to comment
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                </article>
                ))
              )}
            </div>

          </div>

          {/* COMMUNITY SIDEBAR */}
          <aside className="space-y-5 md:sticky md:top-24">

            <div className="rounded-2xl bg-[#17152B] p-6 text-white">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/20 text-xl text-violet-300">
                <FaRocket />
              </div>

              <h3 className="mt-5 text-xl font-bold">
                Build something meaningful.
              </h3>

              <p className="mt-3 text-sm leading-6 text-white/60">
                Every great developer starts somewhere. Learn, practise,
                share your progress and grow with the community.
              </p>

              {!user && (
                <Link
                  to="/register"
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-violet-500 px-4 py-3 text-sm font-semibold text-white hover:bg-violet-400"
                >
                  Join the community <FaArrowRight />
                </Link>
              )}
            </div>

            {/* COMMUNITY GUIDELINES */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6">

              <h3 className="font-bold">
                Community guidelines
              </h3>

              <div className="mt-5 space-y-4 text-sm text-slate-600">

                <p className="flex gap-3">
                  <span className="text-violet-600">01.</span>
                  Encourage and support other learners.
                </p>

                <p className="flex gap-3">
                  <span className="text-violet-600">02.</span>
                  Share knowledge and useful resources.
                </p>

                <p className="flex gap-3">
                  <span className="text-violet-600">03.</span>
                  Respect everyone's learning journey.
                </p>

                <p className="flex gap-3">
                  <span className="text-violet-600">04.</span>
                  Keep discussions constructive.
                </p>

              </div>
            </div>

            {/* CURRENT PROGRAMME */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6">

              <p className="text-xs font-bold uppercase tracking-widest text-violet-700">
                Current programme
              </p>

              <h3 className="mt-3 text-lg font-bold">
                Web Development
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Learn HTML, CSS and JavaScript through practical lessons
                and assignments.
              </p>

              <Link
                to="/courses"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-violet-700 hover:text-violet-900"
              >
                Explore courses <FaArrowRight />
              </Link>

            </div>
          </aside>

        </div>
      </section>


      {/* =================================================
          3. THE DIGITAL PULSE
      ================================================= */}

      <section className="border-t border-slate-100 bg-white py-20">

        <div className="mx-auto max-w-7xl px-5 md:px-10">

          {/* SECTION HEADER */}
          <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

            <div>
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-violet-700">
                <FaNewspaper />
                YouthForge Editorial
              </div>

              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                The Digital Pulse
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500">
                Your window into artificial intelligence, technology,
                innovation and the digital world.
              </p>
            </div>

            <span className="inline-flex items-center gap-2 text-sm font-semibold text-violet-700">
              <FaFire />
              Explore what's happening
            </span>

          </div>

          {/* FEATURED ARTICLE */}
          <div className="grid overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 lg:grid-cols-2">

            <div className="relative min-h-[280px] lg:min-h-[420px]">

              <img
                src={newsArticles[0].image}
                alt="Artificial intelligence technology"
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />

              <div className="absolute left-5 top-5 rounded-full bg-violet-700 px-4 py-2 text-xs font-bold text-white">
                FEATURED STORY
              </div>

            </div>

            <div className="flex flex-col justify-center p-7 sm:p-10">

              <span className="text-xs font-bold uppercase tracking-widest text-violet-700">
                {newsArticles[0].category}
              </span>

              <h3 className="mt-4 text-2xl font-bold leading-tight sm:text-3xl">
                {newsArticles[0].title}
              </h3>

              <p className="mt-5 text-sm leading-7 text-slate-600">
                {newsArticles[0].excerpt}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-2">
                  <FaClock />
                  {newsArticles[0].readTime}
                </span>

                <span>{newsArticles[0].date}</span>
              </div>

              <a
                href={newsArticles[0].url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex w-fit items-center gap-3 rounded-lg bg-violet-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-800"
              >
                Explore AI news <FaArrowRight />
              </a>

            </div>
          </div>

          {/* NEWS GRID */}
          <div className="mt-12 flex items-center justify-between">

            <div>
              <h3 className="text-xl font-bold">
                More from the digital world
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Technology stories worth exploring.
              </p>
            </div>

            <span className="hidden text-xs text-slate-400 sm:block">
              Curated technology resources
            </span>

          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {newsArticles.slice(1).map((article) => (

              <article
                key={article.id}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >

                <div className="relative h-48 overflow-hidden bg-slate-100">

                  <img
                    src={article.image}
                    alt={article.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-bold text-violet-700">
                    {article.category}
                  </span>

                </div>

                <div className="p-5">

                  <h3 className="text-lg font-bold leading-7 transition group-hover:text-violet-700">
                    {article.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {article.excerpt}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">

                    <span className="text-xs text-slate-400">
                      {article.readTime}
                    </span>

                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-bold text-violet-700 hover:text-violet-900"
                    >
                      Read more <FaArrowUpRightFromSquare  />
                    </a>

                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* NEWS EDITORIAL NOTE */}
          <div className="mt-8 flex items-start gap-3 rounded-xl bg-violet-50 p-5">

            <FaLightbulb className="mt-1 shrink-0 text-violet-700" />

            <p className="text-sm leading-6 text-slate-600">
              The Digital Pulse is designed to help young people stay curious,
              informed and connected to developments shaping the future.
              These are sample editorial entries; full articles and verified
              publication dates can be added through the publishing system.
            </p>

          </div>

        </div>
      </section>


      {/* =================================================
          4. EXPLORE THE DIGITAL WORLD
      ================================================= */}

      <section className="bg-slate-50 py-20">

        <div className="mx-auto max-w-7xl px-5 md:px-10">

          <div className="max-w-2xl">

            <p className="text-sm font-bold uppercase tracking-[0.18em] text-violet-700">
              Explore and discover
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Explore the digital world.
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-500">
              Technology is bigger than coding. Discover the fields,
              ideas and innovations creating new possibilities.
            </p>

          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {technologyTopics.map((topic) => {

              const Icon = topic.icon;

              return (
                <a
                  key={topic.title}
                  href={topic.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-2xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg"
                >

                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl ${topic.color}`}>
                    <Icon />
                  </div>

                  <h3 className="mt-5 text-lg font-bold transition group-hover:text-violet-700">
                    {topic.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {topic.description}
                  </p>

                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-violet-700">
                    Explore topic <FaArrowRight />
                  </span>

                </a>
              );
            })}

          </div>

        </div>
      </section>


      {/* =================================================
          5. OPPORTUNITIES
      ================================================= */}

      <section className="bg-white py-20" id="opportunities">

        <div className="mx-auto max-w-7xl px-5 md:px-10">

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

            <div>

              <p className="text-sm font-bold uppercase tracking-[0.18em] text-violet-700">
                Beyond the classroom
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Discover opportunities.
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-500">
                Find places to learn, compete, connect, develop your skills
                and take your next step.
              </p>

            </div>

            <span className="text-xs text-slate-400">
              External opportunity directories
            </span>

          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {opportunities.map((opportunity) => {

              const Icon = opportunity.icon;

              return (
                <article
                  key={opportunity.id}
                  className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
                >

                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl ${opportunity.color}`}>
                    <Icon />
                  </div>

                  <span className="mt-5 text-xs font-bold uppercase tracking-wider text-violet-700">
                    {opportunity.type}
                  </span>

                  <h3 className="mt-2 text-lg font-bold">
                    {opportunity.title}
                  </h3>

                  <p className="mt-3 flex-1 text-sm leading-6 text-slate-500">
                    {opportunity.description}
                  </p>

                  <span className="mt-5 text-[11px] font-semibold text-slate-400">
                    {opportunity.label}
                  </span>

                  <a
                    href={opportunity.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-violet-700 hover:text-violet-900"
                  >
                    Explore <FaArrowUpRightFromSquare  />
                  </a>

                </article>
              );
            })}

          </div>

        </div>
      </section>


      {/* =================================================
          6. FEATURED STUDENT PROJECTS
      ================================================= */}

      <section className="border-y border-slate-100 bg-slate-50 py-20">

        <div className="mx-auto max-w-7xl px-5 md:px-10">

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

            <div>

              <p className="text-sm font-bold uppercase tracking-[0.18em] text-violet-700">
                Made by our community
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Ideas becoming reality.
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-500">
                Discover what students are learning, creating and building.
                Every project starts with an idea.
              </p>

            </div>

            <Link
              to="/courses"
              className="inline-flex items-center gap-2 text-sm font-semibold text-violet-700 hover:text-violet-900"
            >
              Start building <FaArrowRight />
            </Link>

          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">

            {featuredProjects.map((project) => (

              <article
                key={project.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >

                <div className="h-52 overflow-hidden bg-slate-100">

                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
                  />

                </div>

                <div className="p-6">

                  <h3 className="text-lg font-bold">
                    {project.title}
                  </h3>

                  <p className="mt-2 text-xs font-semibold text-violet-700">
                    By {project.student}
                  </p>

                  <p className="mt-4 text-sm leading-6 text-slate-500">
                    {project.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">

                    {project.technology.map((tech) => (

                      <span
                        key={tech}
                        className="rounded-md bg-slate-100 px-3 py-1.5 text-[10px] font-semibold text-slate-600"
                      >
                        {tech}
                      </span>
                    ))}

                  </div>

                </div>
              </article>
            ))}

          </div>

          <div className="mt-8 rounded-2xl border border-violet-100 bg-violet-50 p-6 sm:flex sm:items-center sm:justify-between">

            <div>
              <h3 className="font-bold">
                Working on something interesting?
              </h3>

              <p className="mt-2 text-sm text-slate-600">
                Share your work and inspire someone else to start building.
              </p>
            </div>

            <Link
              to={user ? '/dashboard/profile' : '/register'}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-violet-700 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-800 sm:mt-0"
            >
              Share your journey <FaArrowRight />
            </Link>

          </div>

        </div>
      </section>


      {/* =================================================
          7. CLOSING CTA
      ================================================= */}

      <section className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-16 md:flex-row md:items-center md:justify-between md:px-10 md:py-20">

        <div>

          <div className="flex items-center gap-3">

            <FaRocket className="text-xl text-violet-700" />

            <p className="font-semibold text-violet-700">
              Your journey starts here
            </p>

          </div>

          <h2 className="mt-3 text-3xl font-bold tracking-tight">
            Ready to become a creator?
          </h2>

          <p className="mt-3 max-w-xl leading-7 text-slate-600">
            Learn new skills, share your ideas, build projects and grow
            alongside other young people.
          </p>

        </div>

        <Link
          to="/register"
          className="inline-flex shrink-0 items-center justify-center gap-3 rounded-xl bg-violet-700 px-6 py-3.5 font-semibold text-white transition hover:bg-violet-800"
        >
          Get started <FaArrowRight />
        </Link>

      </section>
      
{/* FOUNDER'S VISION SECTION */}
<section className="relative overflow-hidden bg-white py-20 md:py-28">
  <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50 rounded-full blur-3xl opacity-70 pointer-events-none" />

  <div className="relative max-w-7xl mx-auto px-5 sm:px-8">

    {/* Section heading */}
    <div className="text-center max-w-2xl mx-auto mb-14">
      <span className="inline-flex items-center gap-2 text-sm font-bold tracking-widest uppercase text-[#C79A45]">
        <span className="w-8 h-px bg-[#C79A45]" />
        The Vision Behind YouthForge
        <span className="w-8 h-px bg-[#C79A45]" />
      </span>

      <h2 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#173B5F] leading-tight">
        A generation empowered to
        <span className="text-[#C79A45]"> create the future.</span>
      </h2>

      <p className="mt-5 text-gray-600 leading-relaxed">
        YouthForge is more than a technology programme.
        It is a growing vision to equip young people with
        the skills, knowledge and opportunities to make
        a meaningful difference.
      </p>
    </div>

    {/* Founder content */}
   
<div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

  {/* Founder profile */}
  <div className="relative">
    <div className="absolute -inset-3 bg-[#C79A45]/10 rounded-3xl rotate-2" />

    <div className="relative min-h-[390px] rounded-3xl overflow-hidden bg-[#173B5F] flex flex-col justify-end p-8 md:p-10">

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-48 h-48 rounded-full border border-white/20 bg-white/10 flex items-center justify-center">
          <span className="text-6xl font-extrabold text-white/90">
            AW
          </span>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-[#102A43] via-transparent to-transparent" />

      <div className="relative z-10">
        <span className="text-[#D9B66F] text-xs font-bold tracking-[0.2em] uppercase">
          Meet the Founder
        </span>

        <h3 className="text-3xl font-extrabold text-white mt-3">
          Andikan William
        </h3>

        <p className="text-white/75 mt-2">
          Founder, YouthForge
        </p>

        <div className="mt-5 h-px w-16 bg-[#C79A45]" />

        <p className="text-white/70 text-sm mt-4">
          A vision to empower young people through
          learning, practical development and opportunity.
        </p>
      </div>
    </div>
  </div>

  {/* Founder message */}
  <div>
    <span className="text-[#C79A45] font-bold text-sm uppercase tracking-widest">
      A Message from the Founder
    </span>

    <h3 className="text-3xl md:text-4xl font-extrabold text-[#173B5F] mt-4 leading-tight">
      The beginning of something bigger.
    </h3>

    <div className="mt-6 space-y-4 text-gray-600 leading-8">
      <p>
        YouthForge was born out of a desire to see young
        people equipped, empowered and given opportunities
        to fulfil their potential.
      </p>

      <p>
        I believe that every young person has something
        valuable to contribute to society. However,
        potential needs the right environment, knowledge,
        guidance and opportunities to grow.
      </p>

      <p>
        My vision for YouthForge goes beyond technology.
        I envision a community that develops young people
        intellectually, practically and socially —
        preparing them to become creators, innovators,
        entrepreneurs and responsible leaders.
      </p>

      <p>
        We are beginning with digital skills and technology
        because practical skills create opportunities.
        But this is only the beginning.
      </p>

      <p>
        As we grow, our programmes will expand into
        entrepreneurship, leadership, education,
        innovation and community development.
      </p>
    </div>

    {/* Appreciation */}
    <div className="mt-8 p-6 rounded-2xl bg-[#F8F6F0] border border-[#C79A45]/20">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[#C79A45] text-xl">✦</span>
        <h4 className="font-bold text-[#173B5F]">
          With Gratitude
        </h4>
      </div>

      <p className="text-gray-600 text-sm leading-7">
        I would like to express my sincere appreciation to
        Pastor Chris Oyakhilome and the entire Christ Embassy
        family for the investment they continue to make in
        building, nurturing and equipping young people.
        Through the vision, teachings, guidance and
        opportunities provided by Christ Embassy, we are
        being empowered to discover our purpose, develop
        our abilities and become meaningful contributors
        to society.
      </p>

      <p className="text-gray-600 text-sm leading-7 mt-3">
        YouthForge is also an expression of my gratitude
        and desire to put what we have learned into action
        by creating opportunities for other young people
        to grow, develop and make a positive impact.
      </p>

      <p className="text-[#173B5F] font-semibold text-sm mt-4">
        Thank you, Pastor Chris. Thank you, Christ Embassy.
      </p>
    </div>

    {/* Founder quote */}
    <div className="mt-8 border-l-4 border-[#C79A45] pl-5 py-2">
      <p className="text-[#173B5F] font-bold text-lg italic">
        "We may be starting small, but we are building
        with a much bigger future in mind."
      </p>
    </div>

    {/* Signature */}
    <div className="mt-8">
      <p className="font-bold text-[#173B5F]">
        Dr Andikan William
      </p>
      <p className="text-sm text-gray-500 mt-1">
        Founder, YouthForge
      </p>
      <p className="text-sm text-[#C79A45] font-medium mt-1">
        A youth development initiative under
        Christ Embassy Girne 1
      </p>
    </div>

    <Link
      to="/about"
      className="inline-flex items-center gap-3 mt-8 px-7 py-4 rounded-xl bg-[#173B5F] text-white font-semibold hover:bg-[#102A43] transition-all"
    >
      Discover Our Vision
      <FaArrowRight />
    </Link>
  </div>
</div>


    {/* Our development pillars */}
    <div className="mt-20 pt-12 border-t border-gray-100">
      <div className="text-center mb-10">
        <h3 className="text-2xl font-bold text-[#173B5F]">
          What We Are Building Towards
        </h3>
        <p className="text-gray-500 mt-2">
          Our journey begins with technology, but our vision
          reaches further.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            title: "Technology",
            description: "Digital skills, coding and innovation",
            icon: "01",
          },
          {
            title: "Entrepreneurship",
            description: "Ideas, creativity and business development",
            icon: "02",
          },
          {
            title: "Leadership",
            description: "Character, confidence and responsibility",
            icon: "03",
          },
          {
            title: "Education",
            description: "Knowledge, learning and personal growth",
            icon: "04",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="p-6 rounded-2xl bg-slate-50 border border-gray-100 hover:border-[#C79A45]/50 hover:shadow-lg transition-all"
          >
            <span className="text-[#C79A45] text-sm font-extrabold">
              {item.icon}
            </span>

            <h4 className="font-bold text-[#173B5F] mt-4">
              {item.title}
            </h4>

            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>

  </div>
</section>


    </main>
  );
};

export default Landing;
