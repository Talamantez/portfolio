import { useState } from "preact/hooks";
import ConsciousRobotLogo from "../components/ConsciousRobotLogo.tsx";
export default function ConsciousRobotMarketing() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [errors, setErrors] = useState({});
    const [submitStatus, setSubmitStatus] = useState("");

    const validateForm = () => {
        let formErrors = {};
        if (!formData.name.trim()) formErrors.name = "Name is required";
        if (!formData.email.trim()) formErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            formErrors.email = "Email is invalid";
        }
        if (!formData.message.trim()) {
            formErrors.message = "Message is required";
        } else if (formData.message.trim().length < 10) {
            formErrors.message = "Message must be at least 10 characters";
        }
        return formErrors;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }
        setSubmitStatus("Sending...");

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSubmitStatus("Message sent successfully!");
                setFormData({ name: "", email: "", message: "" });
            } else {
                setSubmitStatus("Failed to send message. Please try again.");
            }
        } catch (error) {
            setSubmitStatus("An error occurred. Please try again later.");
        }
    };

    return (
        <div class="bg-gray-100 font-sans">
            <header class="bg-purple-600 text-white p-4">
                <div class="container mx-auto flex items-center space-x-4">
                    <div class="w-20 h-10 md:w-24 md:h-24 p-2 rounded-full bg-purple-100 flex items-center justify-center">
                        <ConsciousRobotLogo />
                    </div>
                    <h1 class="text-3xl md:text-4xl">
                        <span class="font-KGCastlesCrumbling">conscious </span>
                        <span class="font-KGCastlesCrumbling font-bold">
                            ROBOT
                        </span>
                    </h1>
                </div>
            </header>

            <main class="container mx-auto px-4 py-8">
                <section id="hero" class="text-center py-12 md:py-16">
                    <h2 class="text-3xl md:text-4xl font-bold mb-4">
                        Empowering Nonprofits with Innovative Tech Solutions
                    </h2>
                    <p class="text-lg md:text-xl mb-8">
                        Amplify your impact with secure, reliable, and
                        cost-effective technology!
                    </p>
                    <a
                        href="#contact"
                        class="bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition duration-300"
                    >
                        Get Started
                    </a>
                </section>

                <section id="about" class="my-12">
                    <h2 class="text-2xl md:text-3xl font-bold mb-4">
                        About Conscious Robot
                    </h2>
                    <p class="text-base md:text-lg mb-4">
                        Greetings Humanoid, I'm Robert, the Conscious Robot! I'm
                        here to get you robust web solutions and those right
                        quickly!
                    </p>
                </section>

                <section id="services" class="my-12">
                    <h2 class="text-2xl md:text-3xl font-bold mb-6">
                        Services
                    </h2>
                    <div class="space-y-6">
                        <div class="bg-white p-6 rounded-lg shadow-md">
                            <h3 class="text-xl font-bold mb-2">
                                Outreach
                            </h3>
                            <p class="mb-4">
                                Let's get your message out there! We'll help you
                                create and manage campaigns that drive
                                clicks and contributions.
                            </p>
                            <p>
                            </p>
                        </div>
                        <div class="bg-white p-6 rounded-lg shadow-md">
                            <h3 class="text-xl font-bold mb-2">
                                Apps
                            </h3>
                            <p>
                                Turn your ideas into reality with our custom web
                                app development services. We'll build a solution
                                that meets your unique needs and goals.
                            </p>
                        </div>
                    </div>
                </section>
                <section id="value-proposition" class="my-12">
                    <h2 class="text-2xl md:text-3xl font-bold mb-6">
                        Why Choose Conscious Robot?
                    </h2>

                    <div class="space-y-6">
                        <div class="bg-white p-6 rounded-lg shadow-md">
                            <h3 class="text-xl font-bold mb-2">
                                Smart Pricing
                            </h3>
                            <p class="mb-4">
                                We offer competitive pricing and flexible
                                payment options to help you get the most out of
                                your budget.
                            </p>
                            <p>
                            </p>
                        </div>
                        <div class="bg-white p-6 rounded-lg shadow-md">
                            <h3 class="text-xl font-bold mb-2">
                                Private
                            </h3>
                            <p class="mb-4">
                                Unless explicitly required by your nonprofit, we
                                don't collect, we don't track, and we don't
                                store user data. Your privacy and that of your
                                users are our top priority.
                            </p>
                            <p>
                            </p>
                        </div>
                        <div class="bg-white p-6 rounded-lg shadow-md">
                            <h3 class="text-xl font-bold mb-2">
                                Global
                            </h3>
                            <p>
                                Enhance reliability and speed with our
                                edge-first approach, ensuring your services are
                                always available and responsive, even under high
                                demand.
                            </p>
                        </div>
                        <div class="bg-white p-6 rounded-lg shadow-md">
                            <h3 class="text-xl font-bold mb-2">
                                Instant
                            </h3>
                            <p>
                                We use push to Github to deploy your updates
                                instantly. No more waiting for updates to go
                                live.
                            </p>
                        </div>
                    </div>
                </section>
                <section
                    id="cta"
                    class="bg-purple-100 p-6 md:p-8 rounded-lg my-12 text-center"
                >
                    <h2 class="text-2xl md:text-3xl font-bold mb-4">
                        Ready to Supercharge Your Nonprofit?
                    </h2>
                    <p class="text-lg md:text-xl mb-6">
                        Let's work together to create innovative tech solutions
                        that amplify your impact and secure your mission's
                        future!
                    </p>
                    <a
                        href="#contact"
                        class="bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition duration-300"
                    >
                        Contact Us Today
                    </a>
                </section>

                <section id="contact" class="my-12">
                    <h2 class="text-2xl md:text-3xl font-bold mb-4">
                        Get in Touch
                    </h2>
                    <form class="max-w-lg mx-auto" onSubmit={handleSubmit}>
                        <div class="mb-4">
                            <label htmlFor="name" class="block mb-2">
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                class={`w-full p-2 border rounded ${
                                    errors.name ? "border-red-500" : ""
                                }`}
                                required
                            />
                            {errors.name && (
                                <p class="text-red-500 text-sm mt-1">
                                    {errors.name}
                                </p>
                            )}
                        </div>
                        <div class="mb-4">
                            <label htmlFor="email" class="block mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                class={`w-full p-2 border rounded ${
                                    errors.email ? "border-red-500" : ""
                                }`}
                                required
                            />
                            {errors.email && (
                                <p class="text-red-500 text-sm mt-1">
                                    {errors.email}
                                </p>
                            )}
                        </div>
                        <div class="mb-4">
                            <label htmlFor="message" class="block mb-2">
                                Message
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleInputChange}
                                rows={4}
                                class={`w-full p-2 border rounded ${
                                    errors.message ? "border-red-500" : ""
                                }`}
                                required
                            >
                            </textarea>
                            {errors.message && (
                                <p class="text-red-500 text-sm mt-1">
                                    {errors.message}
                                </p>
                            )}
                        </div>
                        <button
                            type="submit"
                            class="bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition duration-300"
                        >
                            Send Message
                        </button>
                        {submitStatus && (
                            <p class="mt-4 text-center">{submitStatus}</p>
                        )}
                    </form>
                </section>
            </main>

            <footer class="bg-gray-800 text-white p-4">
                <div class="container mx-auto text-center">
                    <p>&copy; 2024 Conscious Robot. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
