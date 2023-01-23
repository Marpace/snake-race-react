function GifImage(props) {

  function handleClick() {
    console.log("clicked")
    props.sendMessage("gif", props.original, props.still);
  }


  return (
    <img onClick={handleClick} className="gif-img" src={props.src} alt={props.alt}></img>
  )
}


export default GifImage