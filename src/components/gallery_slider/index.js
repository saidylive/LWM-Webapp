import React, { useState } from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import imageDescription from "./gallery_description";

import "./gallery.css";
import imageDescriptions from './gallery_description';

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
        let title = image_items?.length ? ` (${image_items[0].key})` : 'Gallery'
        if(image_items?.length){
            const description = Object.hasOwnProperty.call(imageDescriptions, image_items[0].key) ? imageDescriptions[image_items[0].key] : null
            if(description){
                title = description.name
                if(description.location){
                    // title += ` (${description.location})`
                }
            }
        }
        return title
    }

    return <div className={`gallery-container ${useZoom ? 'lg' : ''}`}>
        <div className='gallery-header'>
            <h3 className='gallery-title'>{getTitleName()}</h3>
            <div className='gallery-close' onClick={onClickGalleryClose}>&times;</div>
        </div>
        <div className='slider-container'>
            <Carousel {...sliderConfig}>
                {image_items.map((item, index) => {
                    const description = Object.hasOwnProperty.call(imageDescriptions, item.key) ? imageDescriptions[item.key] : null
                    return <div className="gallery-item" key={index}>
                        <img src={item.url} alt={item.key} />
                        {description ? <>
                            <p className="legend">{description.description}</p>
                        </> : null }
                    </div>
                })}
            </Carousel>
        </div>
    </div>
}

export default GallerySlider;