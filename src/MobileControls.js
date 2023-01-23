const MobileControls = props => {
  return (
    <div className="mobile-controls">
      <div id="mobile-controls__up" className="mobile-controls__arrow up">
          {/* <img src="icons/triangle.png" alt=""></img> */}
      </div>
      <div id="mobile-controls__down" className="mobile-controls__arrow down">
          {/* <img src="icons/triangle.png" style="transform: rotate(180deg);" alt=""></img> */}
      </div>
      <div id="mobile-controls__left" className="mobile-controls__arrow left">
          {/* <img src="icons/triangle.png" style="transform: rotate(-90deg);" alt=""></img> */}
      </div>
      <div id="mobile-controls__right" className="mobile-controls__arrow right">
          {/* <img src="icons/triangle.png" style="transform: rotate(90deg);" alt=""></img> */}
      </div>
    </div>
  )
}

export default MobileControls;