import { Head } from "$fresh/runtime.ts";

export default function ConsciousRobotMarketing() {
  return (
    <div className="bg-gray-100 font-sans">
      <Head>
        <title>Conscious Robot - Empowering Nonprofits with Tech</title>
      </Head>

      <header className="bg-purple-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">Conscious Robot</h1>
        </div>
      </header>

      <main className="container mx-auto mt-8">
        <section id="hero" className="text-center py-16">
          <h2 className="text-4xl font-bold mb-4">Empowering Nonprofits with Innovative Tech Solutions</h2>
          <p className="text-xl mb-8">We're on a mission to amplify your impact through technology</p>
          <a href="#contact" className="bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition duration-300">Get Started</a>
        </section>

        <section id="about" className="my-16">
          <h2 className="text-3xl font-bold mb-4">About Conscious Robot</h2>
          <p className="text-lg">We're a team of tech enthusiasts dedicated to supporting nonprofits. Our goal is to provide innovative, user-friendly solutions that help you focus on what matters most - your mission.</p>
        </section>

        <section id="services" className="my-16">
          <h2 className="text-3xl font-bold mb-4">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">Custom Software Development</h3>
              <p>Tailored solutions to meet your unique needs</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">Data Analytics</h3>
              <p>Unlock insights to drive your decision-making</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">Tech Consulting</h3>
              <p>Expert advice to optimize your tech strategy</p>
            </div>
          </div>
        </section>

        <section id="cta" className="bg-purple-100 p-8 rounded-lg my-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Supercharge Your Nonprofit?</h2>
          <p className="text-xl mb-8">Let's work together to create tech solutions that make a difference!</p>
          <a href="#contact" className="bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition duration-300">Contact Us Today</a>
        </section>

        <section id="contact" className="my-16">
          <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
          <form className="max-w-lg mx-auto">
            <div className="mb-4">
              <label htmlFor="name" className="block mb-2">Name</label>
              <input type="text" id="name" name="name" className="w-full p-2 border rounded" required />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-2">Email</label>
              <input type="email" id="email" name="email" className="w-full p-2 border rounded" required />
            </div>
            <div className="mb-4">
              <label htmlFor="message" className="block mb-2">Message</label>
              <textarea id="message" name="message" rows={4} className="w-full p-2 border rounded" required></textarea>
            </div>
            <button type="submit" className="bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition duration-300">Send Message</button>
          </form>
        </section>
      </main>

      <footer className="bg-gray-800 text-white p-4 mt-16">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 Conscious Robot. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}