import { useState } from "preact/hooks";
import { Head } from "$fresh/runtime.ts";
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
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
        }
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
                headers: {
                    "Content-Type": "application/json",
                },
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
            <Head>
                <title>Conscious Robot - Empowering Nonprofits with Tech</title>
            </Head>

            <header class="bg-purple-600 text-white p-4">
                <div class="flex items-center space-x-4">
                    <div className="w-24 h-24">
                        <ConsciousRobotLogo />
                    </div>
                    <h1 class="text-3xl font-bold ">Conscious Robot</h1>
                </div>
            </header>

            <main class="container mx-auto mt-8">
                <section id="hero" class="text-center py-16">
                    <h2 class="text-4xl font-bold mb-4">
                        Empowering Nonprofits with Innovative Tech Solutions
                    </h2>
                    <p class="text-xl mb-8">
                        Let's amplify your impact through
                        technology
                    </p>
                    <a
                        href="#contact"
                        class="bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition duration-300"
                    >
                        Get Started
                    </a>
                </section>

                <section id="about" class="my-16">
                    <h2 class="text-3xl font-bold mb-4">
                        About Conscious Robot
                    </h2>
                    <p class="text-lg">
                        Hi, I'm Robert! I provide innovative,
                        user-friendly solutions that help you focus on your specific mission. I'm passionate about helping nonprofits achieve reliable scale and speed on your budget. Let's work together to create tech solutions that make a difference!
                    </p>
                </section>

                <section id="services" class="my-16">
                    <h2 class="text-3xl font-bold mb-4">Our Services</h2>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div class="bg-white p-6 rounded-lg shadow-md">
                            <h3 class="text-xl font-bold mb-2">
                                Custom Software Development
                            </h3>
                            <p>Tailored solutions to meet your unique needs</p>
                        </div>
                        <div class="bg-white p-6 rounded-lg shadow-md">
                            <h3 class="text-xl font-bold mb-2">
                                Data Analytics
                            </h3>
                            <p>Unlock insights to drive your decision-making</p>
                        </div>
                        <div class="bg-white p-6 rounded-lg shadow-md">
                            <h3 class="text-xl font-bold mb-2">
                                Tech Consulting
                            </h3>
                            <p>Expert advice to optimize your tech strategy</p>
                        </div>
                    </div>
                </section>

                <section
                    id="cta"
                    class="bg-purple-100 p-8 rounded-lg my-16 text-center"
                >
                    <h2 class="text-3xl font-bold mb-4">
                        Ready to Supercharge Your Nonprofit?
                    </h2>
                    <p class="text-xl mb-8">
                        Let's work together to create tech solutions that make a
                        difference!
                    </p>
                    <a
                        href="#contact"
                        class="bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition duration-300"
                    >
                        Contact Us Today
                    </a>
                </section>

                <section id="contact" class="my-16">
                    <h2 class="text-3xl font-bold mb-4">Get in Touch</h2>
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

            <footer class="bg-gray-800 text-white p-4 mt-16">
                <div class="container mx-auto text-center">
                    <p>&copy; 2024 Conscious Robot. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
