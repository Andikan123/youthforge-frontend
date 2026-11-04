
import {
  FaArrowRight,
  FaLightbulb,
  FaRocket,
  FaUsers,
  FaGraduationCap,
} from 'react-icons/fa6';
import { Link } from 'react-router-dom';

const About = () => {
  const values = [
    {
      icon: <FaGraduationCap />,
      title: 'Skills for the Future',
      description:
        'We help young people develop practical, relevant skills that prepare them for opportunities in a digital world.',
    },
    {
      icon: <FaLightbulb />,
      title: 'Knowledge That Empowers',
      description:
        'We believe knowledge creates possibilities. We make learning accessible, practical, and connected to real-life challenges.',
    },
    {
      icon: <FaUsers />,
      title: 'Community and Collaboration',
      description:
        'We bring young people together to learn, share ideas, build projects, and grow through teamwork.',
    },
    {
      icon: <FaRocket />,
      title: 'From Learning to Opportunity',
      description:
        'We encourage young people to turn their knowledge into meaningful projects, innovation, and future opportunities.',
    },
  ];

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Hero section */}
      <section className="relative overflow-hidden border-b border-gray-100 bg-gradient-to-b from-violet-50 via-white to-white px-6 py-24 sm:py-32">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-violet-200/30 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-indigo-100/40 blur-3xl" />

        <div className="relative mx-auto max-w-5xl text-center">
          <span className="inline-flex items-center rounded-full border border-violet-200 bg-white px-4 py-2 text-sm font-semibold text-violet-700 shadow-sm">
            About YouthForge
          </span>

          <h1 className="mx-auto mt-8 max-w-4xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            Empowering young people with{' '}
            <span className="text-violet-600">skills and knowledge.</span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-gray-600 sm:text-xl">
            We believe every young person deserves the opportunity to learn,
            grow, create, and contribute. YouthForge exists to make practical
            learning accessible and help young people turn their potential
            into real-world impact.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-3 rounded-xl bg-violet-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:-translate-y-0.5 hover:bg-violet-700"
            >
              Become part of YouthForge
              <FaArrowRight />
            </Link>

            <Link
              to="/courses"
              className="inline-flex items-center rounded-xl border border-gray-200 bg-white px-6 py-3.5 font-semibold text-gray-700 transition hover:border-violet-300 hover:text-violet-700"
            >
              Explore our learning
            </Link>
          </div>
        </div>
      </section>

      {/* Mission and vision */}
      <section className="px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-600">
              Our purpose
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Creating pathways to a better future.
            </h2>
            <p className="mt-5 leading-8 text-gray-600">
              Talent is everywhere, but access to opportunities is not.
              YouthForge aims to help close that gap through learning,
              mentorship, practical projects, and a community that supports
              young people as they develop their abilities.
            </p>
          </div>

          <div className="space-y-5">
            <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm sm:p-9">
              <p className="text-sm font-bold uppercase tracking-widest text-violet-600">
                Our mission
              </p>
              <h3 className="mt-3 text-2xl font-bold">
                Make learning practical. Make opportunity accessible.
              </h3>
              <p className="mt-4 max-w-3xl leading-7 text-gray-600">
                Our mission is to empower young people with relevant skills,
                useful knowledge, and hands-on experience that build
                confidence, encourage creativity, and prepare them to solve
                real problems.
              </p>
            </div>

            <div className="rounded-2xl border border-violet-200 bg-violet-50/70 p-7 sm:p-9">
              <p className="text-sm font-bold uppercase tracking-widest text-violet-600">
                Our vision
              </p>
              <h3 className="mt-3 text-2xl font-bold">
                A generation equipped to create its own opportunities.
              </h3>
              <p className="mt-4 max-w-3xl leading-7 text-gray-600">
                We envision a future where young people, regardless of their
                background, can access the knowledge, skills, networks, and
                opportunities they need to innovate, build meaningful careers,
                and contribute to the development of their communities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core values */}
      <section className="border-y border-gray-100 bg-gray-50 px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-600">
              What drives us
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              More than learning to code.
            </h2>
            <p className="mt-5 leading-7 text-gray-600">
              We are building a culture of curiosity, practical learning,
              collaboration, and continuous growth.
            </p>
          </div>

          <div className="space-y-4">
            {values.map((value, index) => (
              <article
                key={value.title}
                className="flex flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-6 transition hover:border-violet-200 hover:shadow-md sm:flex-row sm:items-start sm:p-8"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-xl text-violet-700">
                  {value.icon}
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">
                    {value.title}
                  </h3>
                  <p className="mt-2 max-w-3xl leading-7 text-gray-600">
                    {value.description}
                  </p>
                </div>

                <span className="text-sm font-semibold text-gray-300">
                  0{index + 1}
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Closing section */}
      <section className="px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-5xl rounded-3xl bg-gray-950 px-7 py-14 text-center text-white sm:px-14 sm:py-16">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-300">
            The future is built
          </p>

          <h2 className="mx-auto mt-5 max-w-3xl text-3xl font-bold leading-tight sm:text-5xl">
            Learn something meaningful. Build something useful. Create an impact.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl leading-7 text-gray-300">
            YouthForge is a starting point for young people ready to invest in
            themselves, explore their abilities, and work towards a better
            future.
          </p>

          <Link
            to="/register"
            className="mt-9 inline-flex items-center gap-3 rounded-xl bg-violet-500 px-6 py-3.5 font-semibold text-white transition hover:bg-violet-400"
          >
            Start your journey
            <FaArrowRight />
          </Link>
        </div>
      </section>
    </main>
  );
};

export default About;
