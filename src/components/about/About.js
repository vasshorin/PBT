import React from "react";

const About = () => {
    return (
        <div className="2xl:container 2xl:mx-auto lg:py-16 lg:px-20 md:py-12 md:px-6 py-9 px-4">
            <div className="flex flex-col lg:flex-row justify-between gap-8">
                <div className="w-full lg:w-5/12 flex flex-col justify-center">
                    <h1 className="text-3xl lg:text-4xl font-bold leading-9 text-gray-800 pb-4">About Us</h1>
                    <p className="font-normal text-base leading-6 text-gray-600 ">
            Welcome to our personal budget tracker tool! At our core, we believe
            that financial literacy is key to achieving financial stability and
            success. Our tool is designed to help you track your spending and
            monitor your budget, empowering you to make informed decisions about
            your finances. Our team is made up of individuals who are passionate
            about personal finance and technology. We understand that managing
            money can be overwhelming and complex, so we strive to make our tool
            as user-friendly and accessible as possible. We are committed to
            continuously improving and updating our tool to meet the evolving
            needs of our users. Thank you for choosing our personal budget
            tracker tool. We are honored to be a part of your financial journey.
          </p>
                </div>
                <div className="w-full lg:w-8/12 ">
                    <img className="w-full h-full" src="https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="A group of People" />
                </div>
            </div>

            <div className="flex lg:flex-row flex-col justify-between gap-8 pt-12">
                <div className="w-full lg:w-5/12 flex flex-col justify-center">
                    <h1 className="text-3xl lg:text-4xl font-bold leading-9 text-gray-800 pb-4">Our Story</h1>
                    <p className="font-normal text-base leading-6 text-gray-600 ">lorem ipsum dolor sit amet, consectetur adipiscing elit. 
            Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor.
            Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate,
            felis tellus mollis orci, sed rhoncus sapien nunc eget odio. </p>
            
                </div>
                <div className="w-full lg:w-8/12 lg:pt-8">
                    <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 lg:gap-4 shadow-lg rounded-md">
                        <div className="bg-gray-100 p-4">
                            <h1 className="text-2xl font-bold leading-9 text-gray-800 pb-4">2019</h1>
                            <p className="font-normal text-base leading-6 text-gray-600 ">lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. </p>
                </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
