import React from "react";

const About = () => {
    return (
        <div className="2xl:container 2xl:mx-auto lg:py-16 lg:px-20 md:py-12 md:px-6 py-9 px-4">
            <div className="flex flex-col lg:flex-row justify-between gap-8">
                <div className="w-full lg:w-5/12 flex flex-col justify-center">
                    <h1 className="text-3xl lg:text-4xl font-bold leading-9 text-gray-800 pb-4">About Us</h1>
                    <p className="font-normal text-base leading-6 text-gray-600">
                        Welcome to our personal budget tracker tool! At our core, we believe that financial literacy is key to achieving financial stability and success. Our tool is designed to help you track your spending and monitor your budget, empowering you to make informed decisions about your finances.
                        Our team is made up of individuals who are passionate about personal finance and technology. We understand that managing money can be overwhelming and complex, so we strive to make our tool as user-friendly and accessible as possible.
                        We are committed to continuously improving and updating our tool to meet the evolving needs of our users. Thank you for choosing our personal budget tracker tool. We are honored to be a part of your financial journey.
                    </p>
                </div>
                <div className="w-full lg:w-8/12">
                    <img className="w-full h-full" src="https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="A group of People" />
                </div>
            </div>

            <div className="flex lg:flex-row flex-col justify-between gap-8 pt-12">
                <div className="w-full lg:w-5/12 flex flex-col justify-center">
                    <h1 className="text-3xl lg:text-4xl font-bold leading-9 text-gray-800 pb-4">Our Story</h1>
                    <p className="font-normal text-base leading-6 text-gray-600">
                        This project was created to initially help us track our own personal finances. We wanted to create a tool that was easy to use and accessible to everyone. We are passionate about personal finance and technology, so we decided to combine our interests and create a personal budget tracker tool.
                        We hope that you find our tool useful and that it helps you achieve your financial goals.
                    </p>
                </div>


            </div>
            <div className="pt-12">
                <h1 className="text-3xl lg:text-4xl font-bold leading-9 text-gray-800 pb-4">Our Mission</h1>
                <p className="font-normal text-base leading-6 text-gray-600">
                    Our mission is to empower individuals to take control of their finances and build a strong foundation for their financial future. We believe that everyone deserves access to tools and resources that can help them make better financial decisions.
                    With our personal budget tracker tool, we aim to simplify the process of managing your finances and provide you with valuable insights into your spending habits. By tracking your expenses, setting budget goals, and analyzing your financial data, we want to help you develop healthy financial habits and achieve your financial goals.
                    We are committed to privacy and data security, ensuring that your financial information is protected and confidential. Your trust is important to us, and we strive to maintain the highest standards of security and data protection.
                    Join us on this journey towards financial freedom and let us support you in your pursuit of a healthier financial life.
                </p>
            </div>

        </div>

    );
};

export default About;