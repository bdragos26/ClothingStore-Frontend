import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/homepage.css";

const HomePage = () => {
    const sliderSettings = {
        dots: true,
        dotsClass: "slick-dots",
        infinite: true,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true,
    };

    const images = [
        { src: '/img/fashion1.jpg', alt: 'Fashion Style 1' },
        { src: '/img/fashion2.jpg', alt: 'Fashion Style 2' },
        { src: '/img/fashion3.jpg', alt: 'Fashion Style 3' },
        { src: '/img/fashion4.jpg', alt: 'Fashion Style 3' },
        { src: '/img/fashion5.jpg', alt: 'Fashion Style 3' },
    ];

    return (
        <div className="home-container">
            <Slider {...sliderSettings}>
                {images.map((image, index) => (
                    <div key={index} className="image-slide">
                        <img src={image.src} alt={image.alt} className="fashion-image" />
                        <div className="overlay">
                            <h1 className="animated-text">Explore the Latest Trends</h1>
                            <a href="/products" className="modern-button">
                                View Products
                            </a>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default HomePage;
