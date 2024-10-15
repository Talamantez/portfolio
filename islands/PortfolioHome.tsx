import { useState } from "preact/hooks";
import ConsciousRobotLogo from "../components/ConsciousRobotLogo.tsx";
import LightningIcon from "../components/LightningIcon.tsx";
import ItalicLightningIcon from "../components/ItalicLightningIcon.tsx";
import HoverLightningIcon from "../components/HoverLightningIcon.tsx";

const svgString = ItalicLightningIcon({ width: 50, height: 50 });
console.log(svgString);

export default function ConsciousRobotMarketing() {
    const [isHeaderHovered, setIsHeaderHovered] = useState(false);
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
            <header
                class={`bg-purple-600 text-white p-4 ${
                    isHeaderHovered ? "italic" : ""
                }`}
                onMouseEnter={() => setIsHeaderHovered(true)}
                onMouseLeave={() => setIsHeaderHovered(false)}
            >
                <div class="container mx-auto flex items-center">
                    <div class="w-20 mx-0 h-10 md:w-24 md:h-24 p-2 rounded-full bg-purple-100 flex items-center justify-center">
                        <ConsciousRobotLogo />
                    </div>

                    <div class="font-KGCastlesCrumbling">
                        <h1 class="text-3xl md:text-4xl -mr-1 ml-10 ">
                            conscious
                        </h1>
                    </div>
                    <div>
                        <HoverLightningIcon isHovered={isHeaderHovered} />
                    </div>
                    <div class="font-KGCastlesCrumbling">
                        <h1 class="text-3xl md:text-4xl -ml-1 mr-10">
                            ROBOT
                        </h1>
                    </div>
                </div>
            </header>

            <main class="container mx-auto px-4 py-8">
                <section id="hero" class="text-center">
                    <h2 class="text-3xl md:text-4xl font-bold mb-4">
                        Web Apps for Nonprofits and Pro-social Companies
                    </h2>
                    <p class="text-lg md:text-xl mb-8">
                        Custom apps on your budget
                    </p>
                    <a
                        href="#contact"
                        onMouseEnter={() => setIsHeaderHovered(true)}
                        onMouseLeave={() => setIsHeaderHovered(false)}
                        class="bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition duration-300"
                    >
                        Get Started
                    </a>
                </section>

                <section id="about" class="my-12">
                    <h2 class="text-2xl md:text-3xl font-bold mb-4">
                        Greetings Humanoid!
                    </h2>
                    <p class="text-base md:text-lg mb-4">
                        Do you have an idea for an app that could help your org
                        but don't know where to start?
                    </p>
                    <p class="text-base md:text-lg mb-4">
                        Wake your idea up with Conscious Robot! We'll work
                        within your budget to deliver a fast, secure web app.
                    </p>
                    <p class="text-base md:text-lg mb-4">
                        Let's get the gears turning on your idea!
                    </p>
                    <p class="text-base md:text-lg mb-4 font-bold">
                        Our Process:
                    </p>
                    <div class="space-y-6">
                        <div class="bg-white p-6 rounded-lg shadow-md">
                            <h3 class="text-xl font-bold mb-2">
                                Step 1: Discovery
                            </h3>
                            <p class="mb-4">
                                We'll meet to identify your specific needs and
                                goals.
                            </p>
                        </div>
                        <div class="bg-white p-6 rounded-lg shadow-md">
                            <h3 class="text-xl font-bold mb-2">
                                Step 2: Design
                            </h3>
                            <p class="mb-4">
                                We'll meet with you to talk color themes,
                                typography and branding, then deliver you
                                detailed design options for the key parts of
                                your app.
                            </p>
                        </div>
                        <div class="bg-white p-6 rounded-lg shadow-md">
                            <h3 class="text-xl font-bold mb-2">
                                Step 2: Development
                            </h3>
                            <p class="mb-4">
                                It's time to craft your idea! We'll breathe life
                                into your designs and keep you updated every
                                step of the way.
                            </p>
                        </div>
                        <div class="bg-white p-6 rounded-lg shadow-md">
                            <h3 class="text-xl font-bold mb-2">
                                Step 3: Deployment
                            </h3>
                            <p class="mb-4">
                                We'll get your app live online!
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
                        Let's build that app!
                    </p>
                    <a
                        href="#contact"
                        class="bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition duration-300"
                    >
                        Contact Us Today
                    </a>
                </section>
                <section id="value-proposition" class="my-12">
                    <h2 class="text-2xl md:text-3xl font-bold mb-6">
                        Why Choose Conscious Robot?
                    </h2>

                    <div class="space-y-6">
                        <div class="bg-white p-6 rounded-lg shadow-md">
                            <h3 class="text-xl font-bold mb-2">
                                Enterprise Experience
                            </h3>
                            <p class="mb-4">
                                Corporations have had to solve problems at
                                scale. I'll bring my lessons learned to make
                                sure your app is beautifully designed as well as
                                secure and reliable.
                            </p>
                            <p>
                            </p>
                        </div>
                        <div class="bg-white p-6 rounded-lg shadow-md">
                            <h3 class="text-xl font-bold mb-2">
                                Sliding Scale Pricing
                            </h3>
                            <p class="mb-4">
                                Let's even the playing field! We offer flexible
                                pricing to set you up on budget.
                            </p>
                            <p>
                            </p>
                        </div>
                        <div class="bg-white p-6 rounded-lg shadow-md">
                            <h3 class="text-xl font-bold mb-2">
                                Privacy First
                            </h3>
                            <p class="mb-4">
                                We don't collect, track, or store any user data.
                                Your privacy and that of your users are our top
                                priority.
                            </p>
                            <p>
                            </p>
                        </div>
                        <div class="bg-white p-6 rounded-lg shadow-md">
                            <h3 class="text-xl font-bold mb-2">
                                Reliable
                            </h3>
                            <p>
                                Ensure the global availability of your app even
                                under high demand with our edge-first
                                deployment.
                            </p>
                        </div>
                    </div>
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
