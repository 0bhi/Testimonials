import { Link } from "react-router-dom";
import testimoImage from "../assets/testimo.webp";
const LandingPage = () => {
  return (
    <div className="items-center justify-center flex flex-col min-h-screen bg-slate-900 border-b border-gray-800 pb-4">
      <div className="max-w-4xl text-center justify-between mt-32">
        <h1 className="text-5xl font-bold mb-4 text-white">
          Effortlessly Gather Testimonials from Your Customers
        </h1>
        <p className="text-xl text-gray-400">
          We understand that collecting testimonials can be challenging. That’s
          why we created Testimonial! In just minutes, you can easily collect
          text and video testimonials from your customers—no developers or
          website hosting required.
        </p>
        <Link to="/dashboard">
          <button className="mt-8 px-8 py-4 bg-blue-900 text-white font-bold rounded-lg shadow-lg ">
            Get Started
          </button>
        </Link>
        <img src={testimoImage} alt="Testimonials" className="mt-16 w-" />
      </div>

      <div className="max-w-4xl text-center justify-between">
        <div className="text-white text-xl mt-16">Trusted Customers</div>
        <div className="text-white text-l mt-16">Nobody 😂</div>

        <div className="text-white font-bold text-5xl mt-16">
          Add Testimonials to Your Website—No Coding Required!
        </div>
        <div className="text-white  text-xl mt-8 max-w-4xl text-center">
          Simply copy and paste our HTML code to showcase the Wall of Love (👉
          full version) on your website. It’s compatible with all no-code
          platforms like Webflow, WordPress, and more!
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
