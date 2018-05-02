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
  const x = list.reduce((sum, e) => (sum + e.longitude), 0) / list.length
  const y = list.reduce((sum, e) => (sum + e.latitude), 0) / list.length

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
  iconPath: require('../static/image/people.png'),
  width: 30,
  height: 30
}
