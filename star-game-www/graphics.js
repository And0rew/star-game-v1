function game_loadImage(resourceId, url) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      Game.resources[resourceId] = img
      resolve(img)
    }
    img.src = url
  })
}
