export const showErr = (msg) => {
  wx.showToast({
    title: msg || '出错了～',
    icon: 'none',
    duration: 2000
  })
}

export const getCoordinate = (m) => ({
  longitude: m.coordinate.coordinates[0],
  latitude: m.coordinate.coordinates[1]
})

export const getCoordinates = (list) => (list.map(e => (getCoordinate(e))))

export const calcCenter = (list) => {
  if (list.length < 2) return {}
  const sortedX = list.sort((a, b) => (a.longitude - b.longitude))
  const sortedY = list.sort((a, b) => (a.latitude - b.latitude))
  const x = (sortedX[0].longitude + sortedX.slice(-1).longitude) / 2
  const y = (sortedY[0].latitude + sortedY.slice(-1).latitude) / 2
  return {
    longitude: x,
    latitude: y,
    ...centerAttr
  }
}

export const calcLines = (list, center) => {
  const { longitude, latitude } = center
  return list.map(e => {
    return {
      points: [
        {
          longitude: e.longitude,
          latitude: e.latitude
        },
        {
          longitude,
          latitude
        }
      ],
      color: '#00ff00',
      width: 2
    }
  })
}

const centerAttr = {
  iconPath: require('../static/image/center.png'),
  width: 30,
  height: 30
}
