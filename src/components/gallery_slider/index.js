import React, { useState } from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

import "./gallery.css";

function GallerySlider(props) {
    const [useZoom, setUseZoom] = useState(false)

    const { images, onClose } = props
    const image_items = images ?? []

    const onClickItem = e => {
        setUseZoom(!useZoom)
    }

    const sliderConfig = {
        centerMode: true,
        showArrows: true,
        showIndicators: false,
        showThumbs: false,
        centerSlidePercentage: 100,
        onClickItem: onClickItem
    }

    const onClickGalleryClose = e => {
        if (onClose) {
            onClose(e)
        }
    }

    const getTitleName = () => {
        let title = image_items?.length ? ` (${image_items[0].key})` : ''
        return title
    }

    return <div className={`gallery-container ${useZoom ? 'lg' : ''}`}>
        <div className='gallery-header'>
            <h3 className='gallery-title'>Gallery {getTitleName()}</h3>
            <div className='gallery-close' onClick={onClickGalleryClose}>&times;</div>
        </div>
        <div className='slider-container'>
            <Carousel {...sliderConfig}>
                {image_items.map((item, index) => {
                    return <div className="gallery-item" key={index}>
                        <img src={item.url} alt={item.key} />
                    </div>
                })}
            </Carousel>
        </div>
    </div>
}

export default GallerySlider;